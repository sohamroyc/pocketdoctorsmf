import mongoose from 'mongoose';

const symptomAnalysisSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  symptoms: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    severity: {
      type: String,
      enum: ['mild', 'moderate', 'severe'],
      required: true
    },
    duration: {
      type: String,
      required: true
    },
    frequency: {
      type: String,
      enum: ['constant', 'intermittent', 'occasional', 'rare'],
      default: 'intermittent'
    },
    triggers: [String],
    notes: String
  }],
  additionalInfo: {
    age: Number,
    gender: String,
    medicalHistory: [String],
    currentMedications: [String],
    allergies: [String],
    recentTravel: Boolean,
    recentExposure: String,
    painScale: {
      type: Number,
      min: 0,
      max: 10
    }
  },
  aiAnalysis: {
    analysis: {
      type: String,
      required: true
    },
    possibleConditions: [{
      name: String,
      probability: {
        type: Number,
        min: 0,
        max: 100
      },
      description: String,
      severity: {
        type: String,
        enum: ['mild', 'moderate', 'severe', 'critical']
      }
    }],
    riskLevel: {
      type: String,
      enum: ['low', 'moderate', 'high', 'critical'],
      required: true
    },
    confidence: {
      type: Number,
      min: 0,
      max: 100,
      required: true
    },
    recommendations: [{
      type: String,
      required: true
    }],
    urgencyLevel: {
      type: String,
      enum: ['low', 'moderate', 'high', 'critical'],
      required: true
    },
    medicalHelp: {
      type: String,
      required: true
    },
    followUpRequired: {
      type: Boolean,
      default: false
    },
    followUpTimeframe: String
  },
  userFeedback: {
    helpful: Boolean,
    accuracy: {
      type: Number,
      min: 1,
      max: 5
    },
    comments: String,
    didSeekMedicalHelp: Boolean,
    medicalOutcome: String
  },
  status: {
    type: String,
    enum: ['pending', 'analyzed', 'followed_up', 'resolved', 'escalated'],
    default: 'pending'
  },
  isEmergency: {
    type: Boolean,
    default: false
  },
  emergencyContacted: {
    type: Boolean,
    default: false
  },
  emergencyContactTime: Date
}, {
  timestamps: true
});

// Indexes for better query performance
symptomAnalysisSchema.index({ userId: 1, createdAt: -1 });
symptomAnalysisSchema.index({ 'aiAnalysis.riskLevel': 1 });
symptomAnalysisSchema.index({ 'aiAnalysis.urgencyLevel': 1 });
symptomAnalysisSchema.index({ status: 1 });
symptomAnalysisSchema.index({ isEmergency: 1 });

// Virtual for symptom summary
symptomAnalysisSchema.virtual('symptomSummary').get(function() {
  return this.symptoms.map(s => `${s.name} (${s.severity})`).join(', ');
});

// Method to check if analysis is high priority
symptomAnalysisSchema.methods.isHighPriority = function() {
  return this.aiAnalysis.riskLevel === 'high' || 
         this.aiAnalysis.riskLevel === 'critical' ||
         this.aiAnalysis.urgencyLevel === 'high' ||
         this.aiAnalysis.urgencyLevel === 'critical' ||
         this.isEmergency;
};

// Method to get risk color
symptomAnalysisSchema.methods.getRiskColor = function() {
  const riskColors = {
    low: '#10B981',      // green
    moderate: '#F59E0B', // yellow
    high: '#EF4444',     // red
    critical: '#DC2626'  // dark red
  };
  return riskColors[this.aiAnalysis.riskLevel] || '#6B7280';
};

// Method to get urgency icon
symptomAnalysisSchema.methods.getUrgencyIcon = function() {
  const urgencyIcons = {
    low: '🟢',
    moderate: '🟡',
    high: '🟠',
    critical: '🔴'
  };
  return urgencyIcons[this.aiAnalysis.urgencyLevel] || '⚪';
};

// Static method to get analyses by risk level
symptomAnalysisSchema.statics.getByRiskLevel = function(userId, riskLevel) {
  return this.find({
    userId,
    'aiAnalysis.riskLevel': riskLevel
  }).sort({ createdAt: -1 });
};

// Static method to get emergency cases
symptomAnalysisSchema.statics.getEmergencyCases = function(userId) {
  return this.find({
    userId,
    $or: [
      { isEmergency: true },
      { 'aiAnalysis.riskLevel': 'critical' },
      { 'aiAnalysis.urgencyLevel': 'critical' }
    ]
  }).sort({ createdAt: -1 });
};

// Static method to get recent analyses
symptomAnalysisSchema.statics.getRecentAnalyses = function(userId, limit = 10) {
  return this.find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Pre-save middleware to set emergency flag
symptomAnalysisSchema.pre('save', function(next) {
  if (this.aiAnalysis.riskLevel === 'critical' || 
      this.aiAnalysis.urgencyLevel === 'critical') {
    this.isEmergency = true;
  }
  next();
});

const SymptomAnalysis = mongoose.model('SymptomAnalysis', symptomAnalysisSchema);

export default SymptomAnalysis;

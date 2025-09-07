import mongoose from 'mongoose';

const xRayAnalysisSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  imageData: {
    filename: {
      type: String,
      required: true
    },
    originalName: {
      type: String,
      required: true
    },
    mimeType: {
      type: String,
      required: true
    },
    size: {
      type: Number,
      required: true
    },
    url: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  },
  imageMetadata: {
    width: Number,
    height: Number,
    format: String,
    compression: String,
    quality: Number
  },
  aiAnalysis: {
    confidence: {
      type: Number,
      min: 0,
      max: 100,
      required: true
    },
    diseases: [{
      name: {
        type: String,
        required: true
      },
      probability: {
        type: Number,
        min: 0,
        max: 100,
        required: true
      },
      level: {
        type: String,
        enum: ['normal', 'warning', 'critical'],
        required: true
      },
      description: {
        type: String,
        required: true
      },
      anatomicalRegion: String,
      severity: {
        type: String,
        enum: ['mild', 'moderate', 'severe'],
        default: 'mild'
      }
    }],
    recommendations: [{
      type: String,
      required: true
    }],
    overallAssessment: {
      type: String,
      required: true
    },
    urgencyLevel: {
      type: String,
      enum: ['low', 'moderate', 'high', 'critical'],
      required: true
    },
    followUpRequired: {
      type: Boolean,
      default: false
    },
    followUpTimeframe: String,
    specialistReferral: {
      required: Boolean,
      specialty: String,
      urgency: String
    }
  },
  clinicalContext: {
    bodyPart: {
      type: String,
      enum: ['chest', 'abdomen', 'pelvis', 'spine', 'extremities', 'skull', 'other'],
      required: true
    },
    view: {
      type: String,
      enum: ['AP', 'PA', 'lateral', 'oblique', 'other'],
      default: 'AP'
    },
    contrast: {
      type: Boolean,
      default: false
    },
    patientPosition: String,
    clinicalIndication: String,
    previousStudies: [String]
  },
  radiologistNotes: {
    type: String,
    trim: true
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
    medicalOutcome: String,
    confirmedDiagnosis: String
  },
  status: {
    type: String,
    enum: ['pending', 'analyzed', 'reviewed', 'followed_up', 'resolved'],
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
  emergencyContactTime: Date,
  tags: [String],
  isPrivate: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for better query performance
xRayAnalysisSchema.index({ userId: 1, createdAt: -1 });
xRayAnalysisSchema.index({ 'aiAnalysis.confidence': -1 });
xRayAnalysisSchema.index({ 'aiAnalysis.urgencyLevel': 1 });
xRayAnalysisSchema.index({ 'clinicalContext.bodyPart': 1 });
xRayAnalysisSchema.index({ status: 1 });
xRayAnalysisSchema.index({ isEmergency: 1 });

// Virtual for highest probability disease
xRayAnalysisSchema.virtual('primaryFinding').get(function() {
  if (this.aiAnalysis.diseases.length === 0) return null;
  
  return this.aiAnalysis.diseases.reduce((max, disease) => 
    disease.probability > max.probability ? disease : max
  );
});

// Virtual for critical findings
xRayAnalysisSchema.virtual('criticalFindings').get(function() {
  return this.aiAnalysis.diseases.filter(disease => 
    disease.level === 'critical' || disease.severity === 'severe'
  );
});

// Method to check if analysis requires immediate attention
xRayAnalysisSchema.methods.requiresImmediateAttention = function() {
  return this.aiAnalysis.urgencyLevel === 'critical' ||
         this.isEmergency ||
         this.criticalFindings.length > 0;
};

// Method to get urgency color
xRayAnalysisSchema.methods.getUrgencyColor = function() {
  const urgencyColors = {
    low: '#10B981',      // green
    moderate: '#F59E0B', // yellow
    high: '#EF4444',     // red
    critical: '#DC2626'  // dark red
  };
  return urgencyColors[this.aiAnalysis.urgencyLevel] || '#6B7280';
};

// Method to get confidence level
xRayAnalysisSchema.methods.getConfidenceLevel = function() {
  if (this.aiAnalysis.confidence >= 90) return 'high';
  if (this.aiAnalysis.confidence >= 70) return 'medium';
  return 'low';
};

// Method to get summary
xRayAnalysisSchema.methods.getSummary = function() {
  const primary = this.primaryFinding;
  if (!primary) return 'No significant findings detected';
  
  return `${primary.name} (${primary.probability}% confidence) - ${primary.level.toUpperCase()}`;
};

// Static method to get analyses by body part
xRayAnalysisSchema.statics.getByBodyPart = function(userId, bodyPart) {
  return this.find({
    userId,
    'clinicalContext.bodyPart': bodyPart
  }).sort({ createdAt: -1 });
};

// Static method to get high-confidence analyses
xRayAnalysisSchema.statics.getHighConfidenceAnalyses = function(userId, minConfidence = 80) {
  return this.find({
    userId,
    'aiAnalysis.confidence': { $gte: minConfidence }
  }).sort({ createdAt: -1 });
};

// Static method to get emergency cases
xRayAnalysisSchema.statics.getEmergencyCases = function(userId) {
  return this.find({
    userId,
    $or: [
      { isEmergency: true },
      { 'aiAnalysis.urgencyLevel': 'critical' },
      { 'aiAnalysis.diseases.level': 'critical' }
    ]
  }).sort({ createdAt: -1 });
};

// Static method to get recent analyses
xRayAnalysisSchema.statics.getRecentAnalyses = function(userId, limit = 10) {
  return this.find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Pre-save middleware to set emergency flag
xRayAnalysisSchema.pre('save', function(next) {
  if (this.aiAnalysis.urgencyLevel === 'critical' || 
      this.criticalFindings.length > 0) {
    this.isEmergency = true;
  }
  next();
});

const XRayAnalysis = mongoose.model('XRayAnalysis', xRayAnalysisSchema);

export default XRayAnalysis;

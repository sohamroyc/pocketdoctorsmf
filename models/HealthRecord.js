import mongoose from 'mongoose';

const healthRecordSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recordType: {
    type: String,
    enum: ['symptom_analysis', 'xray_analysis', 'medication_log', 'vital_signs', 'appointment', 'lab_result'],
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  symptoms: [{
    name: String,
    severity: {
      type: String,
      enum: ['mild', 'moderate', 'severe'],
      default: 'mild'
    },
    duration: String,
    notes: String
  }],
  vitalSigns: {
    bloodPressure: {
      systolic: Number,
      diastolic: Number,
      unit: {
        type: String,
        default: 'mmHg'
      }
    },
    heartRate: {
      value: Number,
      unit: {
        type: String,
        default: 'bpm'
      }
    },
    temperature: {
      value: Number,
      unit: {
        type: String,
        default: '°F'
      }
    },
    weight: {
      value: Number,
      unit: {
        type: String,
        default: 'lbs'
      }
    },
    height: {
      value: Number,
      unit: {
        type: String,
        default: 'inches'
      }
    }
  },
  aiAnalysis: {
    analysis: String,
    riskLevel: {
      type: String,
      enum: ['low', 'moderate', 'high', 'critical'],
      default: 'low'
    },
    confidence: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    recommendations: [String],
    urgencyLevel: {
      type: String,
      enum: ['low', 'moderate', 'high', 'critical'],
      default: 'low'
    }
  },
  attachments: [{
    filename: String,
    originalName: String,
    mimeType: String,
    size: Number,
    url: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  doctorNotes: {
    type: String,
    trim: true
  },
  followUpRequired: {
    type: Boolean,
    default: false
  },
  followUpDate: Date,
  status: {
    type: String,
    enum: ['active', 'resolved', 'monitoring', 'archived'],
    default: 'active'
  },
  tags: [String],
  isPrivate: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for better query performance
healthRecordSchema.index({ userId: 1, createdAt: -1 });
healthRecordSchema.index({ recordType: 1 });
healthRecordSchema.index({ 'aiAnalysis.riskLevel': 1 });
healthRecordSchema.index({ status: 1 });

// Virtual for BMI calculation
healthRecordSchema.virtual('bmi').get(function() {
  if (this.vitalSigns.weight && this.vitalSigns.height) {
    const weightKg = this.vitalSigns.weight.unit === 'lbs' 
      ? this.vitalSigns.weight.value * 0.453592 
      : this.vitalSigns.weight.value;
    const heightM = this.vitalSigns.height.unit === 'inches' 
      ? this.vitalSigns.height.value * 0.0254 
      : this.vitalSigns.height.value;
    
    return (weightKg / (heightM * heightM)).toFixed(1);
  }
  return null;
});

// Method to get risk level color
healthRecordSchema.methods.getRiskColor = function() {
  const riskColors = {
    low: '#10B981',      // green
    moderate: '#F59E0B', // yellow
    high: '#EF4444',     // red
    critical: '#DC2626'  // dark red
  };
  return riskColors[this.aiAnalysis.riskLevel] || '#6B7280';
};

// Static method to get records by user and date range
healthRecordSchema.statics.getRecordsByDateRange = function(userId, startDate, endDate) {
  return this.find({
    userId,
    createdAt: {
      $gte: startDate,
      $lte: endDate
    }
  }).sort({ createdAt: -1 });
};

// Static method to get high-risk records
healthRecordSchema.statics.getHighRiskRecords = function(userId) {
  return this.find({
    userId,
    'aiAnalysis.riskLevel': { $in: ['high', 'critical'] },
    status: 'active'
  }).sort({ createdAt: -1 });
};

const HealthRecord = mongoose.model('HealthRecord', healthRecordSchema);

export default HealthRecord;

const mongoose = require('mongoose');

const grievanceSchema = new mongoose.Schema({
  // Basic Information
  title: {
    type: String,
    required: [true, 'Grievance title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Grievance description is required'],
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  category: {
    type: String,
    required: [true, 'Grievance category is required'],
    enum: [
      'application_status',
      'payment_issues',
      'document_verification',
      'technical_issues',
      'general_inquiry',
      'complaint',
      'other'
    ]
  },
  subCategory: {
    type: String,
    trim: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },

  // Complainant Information
  complainant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Complainant is required']
  },
  complainantName: {
    type: String,
    required: [true, 'Complainant name is required']
  },
  complainantEmail: {
    type: String,
    required: [true, 'Complainant email is required']
  },
  complainantMobile: {
    type: String,
    required: [true, 'Complainant mobile is required']
  },
  complainantType: {
    type: String,
    enum: ['beneficiary', 'officer', 'public'],
    required: [true, 'Complainant type is required']
  },

  // Related Information
  relatedBeneficiary: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Beneficiary'
  },
  relatedApplication: {
    type: String // Application ID or reference
  },
  relatedFund: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Fund'
  },

  // Status and Resolution
  status: {
    type: String,
    enum: ['open', 'in_progress', 'resolved', 'closed', 'rejected'],
    default: 'open'
  },
  resolution: {
    description: String,
    resolutionDate: Date,
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    resolutionType: {
      type: String,
      enum: ['resolved', 'duplicate', 'invalid', 'escalated', 'closed']
    },
    followUpRequired: {
      type: Boolean,
      default: false
    },
    followUpDate: Date
  },

  // Assignment
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  assignedAt: Date,
  assignedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  // Escalation
  escalation: {
    isEscalated: {
      type: Boolean,
      default: false
    },
    escalatedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    escalatedAt: Date,
    escalatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    escalationReason: String,
    escalationLevel: {
      type: Number,
      default: 1
    }
  },

  // Communication
  communications: [{
    type: {
      type: String,
      enum: ['email', 'sms', 'call', 'system'],
      required: true
    },
    message: {
      type: String,
      required: true
    },
    sentBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    sentAt: {
      type: Date,
      default: Date.now
    },
    isRead: {
      type: Boolean,
      default: false
    },
    readAt: Date
  }],

  // Attachments
  attachments: [{
    fileName: {
      type: String,
      required: true
    },
    filePath: {
      type: String,
      required: true
    },
    fileSize: Number,
    mimeType: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],

  // Feedback
  feedback: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    submittedAt: Date,
    isPublic: {
      type: Boolean,
      default: false
    }
  },

  // SLA Tracking
  sla: {
    targetResolutionTime: {
      type: Number, // in hours
      default: 72 // 3 days default
    },
    actualResolutionTime: Number,
    isOverdue: {
      type: Boolean,
      default: false
    },
    overdueReason: String
  },

  // Audit Fields
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lastModifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  lastModifiedAt: {
    type: Date,
    default: Date.now
  },

  // Status Flags
  isActive: {
    type: Boolean,
    default: true
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  isPublic: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for age in days
grievanceSchema.virtual('ageInDays').get(function() {
  const now = new Date();
  const created = new Date(this.createdAt);
  const diffTime = Math.abs(now - created);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Virtual for SLA status
grievanceSchema.virtual('slaStatus').get(function() {
  if (this.status === 'resolved' || this.status === 'closed') {
    return 'completed';
  }
  
  const now = new Date();
  const created = new Date(this.createdAt);
  const hoursElapsed = (now - created) / (1000 * 60 * 60);
  
  if (hoursElapsed > this.sla.targetResolutionTime) {
    return 'overdue';
  } else if (hoursElapsed > this.sla.targetResolutionTime * 0.8) {
    return 'warning';
  }
  
  return 'normal';
});

// Virtual for response time
grievanceSchema.virtual('responseTime').get(function() {
  if (this.status === 'resolved' && this.resolution.resolutionDate) {
    const created = new Date(this.createdAt);
    const resolved = new Date(this.resolution.resolutionDate);
    return Math.ceil((resolved - created) / (1000 * 60 * 60)); // in hours
  }
  return null;
});

// Indexes
grievanceSchema.index({ status: 1 });
grievanceSchema.index({ category: 1 });
grievanceSchema.index({ priority: 1 });
grievanceSchema.index({ complainant: 1 });
grievanceSchema.index({ assignedTo: 1 });
grievanceSchema.index({ createdAt: -1 });
grievanceSchema.index({ 'escalation.isEscalated': 1 });
grievanceSchema.index({ 'sla.isOverdue': 1 });

// Pre-save middleware
grievanceSchema.pre('save', function(next) {
  // Update SLA tracking
  if (this.isModified('status') && this.status === 'resolved' && this.resolution.resolutionDate) {
    const created = new Date(this.createdAt);
    const resolved = new Date(this.resolution.resolutionDate);
    this.sla.actualResolutionTime = Math.ceil((resolved - created) / (1000 * 60 * 60));
  }

  // Check if overdue
  if (this.status !== 'resolved' && this.status !== 'closed') {
    const now = new Date();
    const created = new Date(this.createdAt);
    const hoursElapsed = (now - created) / (1000 * 60 * 60);
    this.sla.isOverdue = hoursElapsed > this.sla.targetResolutionTime;
  }

  // Update last modified
  if (this.isModified() && !this.isNew) {
    this.lastModifiedAt = new Date();
  }

  next();
});

// Instance methods
grievanceSchema.methods.assign = function(assignedTo, assignedBy) {
  this.assignedTo = assignedTo;
  this.assignedAt = new Date();
  this.assignedBy = assignedBy;
  this.status = 'in_progress';
  return this.save();
};

grievanceSchema.methods.resolve = function(resolvedBy, resolutionData) {
  this.status = 'resolved';
  this.resolution = {
    ...resolutionData,
    resolvedBy,
    resolutionDate: new Date()
  };
  this.sla.actualResolutionTime = Math.ceil((new Date() - this.createdAt) / (1000 * 60 * 60));
  return this.save();
};

grievanceSchema.methods.escalate = function(escalatedTo, escalatedBy, reason) {
  this.escalation.isEscalated = true;
  this.escalation.escalatedTo = escalatedTo;
  this.escalation.escalatedBy = escalatedBy;
  this.escalation.escalatedAt = new Date();
  this.escalation.escalationReason = reason;
  this.escalation.escalationLevel += 1;
  this.assignedTo = escalatedTo;
  this.assignedAt = new Date();
  this.assignedBy = escalatedBy;
  return this.save();
};

grievanceSchema.methods.addCommunication = function(communicationData) {
  this.communications.push(communicationData);
  return this.save();
};

grievanceSchema.methods.addAttachment = function(attachmentData) {
  this.attachments.push(attachmentData);
  return this.save();
};

grievanceSchema.methods.submitFeedback = function(feedbackData) {
  this.feedback = {
    ...feedbackData,
    submittedAt: new Date()
  };
  return this.save();
};

grievanceSchema.methods.close = function(closedBy, reason) {
  this.status = 'closed';
  this.resolution = {
    ...this.resolution,
    resolutionType: 'closed',
    resolvedBy: closedBy,
    resolutionDate: new Date()
  };
  return this.save();
};

// Static methods
grievanceSchema.statics.getStats = async function(filters = {}) {
  const pipeline = [
    { $match: { isDeleted: false, ...filters } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ];

  return await this.aggregate(pipeline);
};

grievanceSchema.statics.getOverdueGrievances = async function() {
  return await this.find({
    isDeleted: false,
    status: { $in: ['open', 'in_progress'] },
    'sla.isOverdue': true
  }).populate('assignedTo', 'firstName lastName email');
};

grievanceSchema.statics.getSLAReport = async function(startDate, endDate) {
  const pipeline = [
    {
      $match: {
        isDeleted: false,
        createdAt: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: {
          category: '$category',
          status: '$status'
        },
        count: { $sum: 1 },
        avgResolutionTime: { $avg: '$sla.actualResolutionTime' },
        overdueCount: {
          $sum: { $cond: ['$sla.isOverdue', 1, 0] }
        }
      }
    }
  ];

  return await this.aggregate(pipeline);
};

module.exports = mongoose.model('Grievance', grievanceSchema);

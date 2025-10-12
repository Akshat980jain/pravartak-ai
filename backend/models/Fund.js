const mongoose = require('mongoose');

const fundSchema = new mongoose.Schema({
  // Beneficiary Information
  beneficiary: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Beneficiary',
    required: [true, 'Beneficiary is required']
  },
  beneficiaryName: {
    type: String,
    required: [true, 'Beneficiary name is required']
  },
  beneficiaryAadhaar: {
    type: String,
    required: [true, 'Beneficiary Aadhaar is required']
  },

  // Scheme Information
  scheme: {
    name: {
      type: String,
      required: [true, 'Scheme name is required']
    },
    code: {
      type: String,
      required: [true, 'Scheme code is required']
    },
    category: {
      type: String,
      enum: ['PCR', 'POA', 'other'],
      required: [true, 'Scheme category is required']
    },
    description: String
  },

  // Financial Information
  amount: {
    sanctioned: {
      type: Number,
      required: [true, 'Sanctioned amount is required'],
      min: [0, 'Sanctioned amount cannot be negative']
    },
    disbursed: {
      type: Number,
      default: 0,
      min: [0, 'Disbursed amount cannot be negative']
    },
    pending: {
      type: Number,
      default: function() {
        return this.amount.sanctioned - this.amount.disbursed;
      }
    }
  },

  // Bank Details
  bankDetails: {
    accountHolderName: {
      type: String,
      required: [true, 'Account holder name is required']
    },
    accountNumber: {
      type: String,
      required: [true, 'Account number is required']
    },
    ifscCode: {
      type: String,
      required: [true, 'IFSC code is required']
    },
    bankName: {
      type: String,
      required: [true, 'Bank name is required']
    },
    branchName: {
      type: String,
      required: [true, 'Branch name is required']
    }
  },

  // Transaction Information
  transaction: {
    status: {
      type: String,
      enum: ['pending', 'initiated', 'processing', 'successful', 'failed', 'cancelled'],
      default: 'pending'
    },
    utrNumber: {
      type: String,
      unique: true,
      sparse: true
    },
    transactionId: {
      type: String,
      unique: true,
      sparse: true
    },
    referenceNumber: {
      type: String,
      unique: true,
      sparse: true
    },
    initiatedAt: Date,
    processedAt: Date,
    completedAt: Date,
    failureReason: String,
    retryCount: {
      type: Number,
      default: 0
    },
    maxRetries: {
      type: Number,
      default: 3
    }
  },

  // Approval Information
  approval: {
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    approvedAt: Date,
    remarks: String,
    rejectionReason: String
  },

  // Sanction Information
  sanction: {
    orderNumber: {
      type: String,
      required: [true, 'Sanction order number is required']
    },
    orderDate: {
      type: Date,
      required: [true, 'Sanction order date is required']
    },
    validUntil: {
      type: Date,
      required: [true, 'Sanction validity date is required']
    },
    documentPath: String
  },

  // Disbursement Information
  disbursement: {
    method: {
      type: String,
      enum: ['DBT', 'cheque', 'cash'],
      default: 'DBT'
    },
    initiatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    initiatedAt: Date,
    processedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    processedAt: Date,
    completedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    completedAt: Date,
    remarks: String
  },

  // Audit Information
  audit: {
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
    version: {
      type: Number,
      default: 1
    }
  },

  // Status and Flags
  isActive: {
    type: Boolean,
    default: true
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },

  // Notifications
  notifications: {
    beneficiaryNotified: {
      type: Boolean,
      default: false
    },
    beneficiaryNotifiedAt: Date,
    officerNotified: {
      type: Boolean,
      default: false
    },
    officerNotifiedAt: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for transaction status display
fundSchema.virtual('statusDisplay').get(function() {
  if (this.approval.status === 'rejected') return 'Rejected';
  if (this.approval.status === 'pending') return 'Pending Approval';
  if (this.transaction.status === 'pending') return 'Pending Disbursement';
  if (this.transaction.status === 'initiated') return 'Disbursement Initiated';
  if (this.transaction.status === 'processing') return 'Processing';
  if (this.transaction.status === 'successful') return 'Disbursed';
  if (this.transaction.status === 'failed') return 'Failed';
  if (this.transaction.status === 'cancelled') return 'Cancelled';
  return 'Unknown';
});

// Virtual for days since sanction
fundSchema.virtual('daysSinceSanction').get(function() {
  if (!this.sanction.orderDate) return null;
  const today = new Date();
  const sanctionDate = new Date(this.sanction.orderDate);
  const diffTime = Math.abs(today - sanctionDate);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Virtual for sanction validity status
fundSchema.virtual('isSanctionValid').get(function() {
  if (!this.sanction.validUntil) return true;
  return new Date(this.sanction.validUntil) > new Date();
});

// Indexes
fundSchema.index({ beneficiary: 1 });
fundSchema.index({ 'scheme.code': 1 });
fundSchema.index({ 'transaction.status': 1 });
fundSchema.index({ 'approval.status': 1 });
fundSchema.index({ 'transaction.utrNumber': 1 });
fundSchema.index({ 'transaction.transactionId': 1 });
fundSchema.index({ 'sanction.orderNumber': 1 });
fundSchema.index({ createdAt: -1 });
fundSchema.index({ 'audit.createdBy': 1 });

// Pre-save middleware
fundSchema.pre('save', function(next) {
  // Update pending amount
  this.amount.pending = this.amount.sanctioned - this.amount.disbursed;
  
  // Update last modified information
  if (this.isModified() && !this.isNew) {
    this.audit.lastModifiedAt = new Date();
    this.audit.version += 1;
  }
  
  next();
});

// Instance methods
fundSchema.methods.approve = function(userId, remarks = null) {
  this.approval.status = 'approved';
  this.approval.approvedBy = userId;
  this.approval.approvedAt = new Date();
  if (remarks) {
    this.approval.remarks = remarks;
  }
  return this.save();
};

fundSchema.methods.reject = function(userId, reason) {
  this.approval.status = 'rejected';
  this.approval.rejectionReason = reason;
  this.approval.approvedBy = userId;
  this.approval.approvedAt = new Date();
  return this.save();
};

fundSchema.methods.initiateDisbursement = function(userId) {
  this.transaction.status = 'initiated';
  this.transaction.initiatedAt = new Date();
  this.disbursement.initiatedBy = userId;
  this.disbursement.initiatedAt = new Date();
  return this.save();
};

fundSchema.methods.processTransaction = function(userId, transactionId, utrNumber = null) {
  this.transaction.status = 'processing';
  this.transaction.processedAt = new Date();
  this.transaction.transactionId = transactionId;
  if (utrNumber) {
    this.transaction.utrNumber = utrNumber;
  }
  this.disbursement.processedBy = userId;
  this.disbursement.processedAt = new Date();
  return this.save();
};

fundSchema.methods.completeTransaction = function(userId, utrNumber = null) {
  this.transaction.status = 'successful';
  this.transaction.completedAt = new Date();
  this.amount.disbursed = this.amount.sanctioned;
  this.amount.pending = 0;
  if (utrNumber) {
    this.transaction.utrNumber = utrNumber;
  }
  this.disbursement.completedBy = userId;
  this.disbursement.completedAt = new Date();
  return this.save();
};

fundSchema.methods.failTransaction = function(reason) {
  this.transaction.status = 'failed';
  this.transaction.failureReason = reason;
  this.transaction.retryCount += 1;
  return this.save();
};

fundSchema.methods.retryTransaction = function() {
  if (this.transaction.retryCount < this.transaction.maxRetries) {
    this.transaction.status = 'pending';
    this.transaction.failureReason = null;
    return this.save();
  }
  throw new Error('Maximum retry attempts exceeded');
};

fundSchema.methods.cancelTransaction = function(reason) {
  this.transaction.status = 'cancelled';
  this.transaction.failureReason = reason;
  return this.save();
};

// Static methods
fundSchema.statics.getDisbursementStats = async function(filters = {}) {
  const pipeline = [
    { $match: { isDeleted: false, ...filters } },
    {
      $group: {
        _id: '$transaction.status',
        count: { $sum: 1 },
        totalAmount: { $sum: '$amount.sanctioned' },
        disbursedAmount: { $sum: '$amount.disbursed' }
      }
    }
  ];

  return await this.aggregate(pipeline);
};

fundSchema.statics.getMonthlyDisbursements = async function(year, month) {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);

  return await this.find({
    'transaction.completedAt': {
      $gte: startDate,
      $lte: endDate
    },
    'transaction.status': 'successful',
    isDeleted: false
  }).populate('beneficiary', 'firstName lastName mobile');
};

fundSchema.statics.getPendingDisbursements = async function() {
  return await this.find({
    'approval.status': 'approved',
    'transaction.status': { $in: ['pending', 'initiated', 'processing'] },
    isDeleted: false
  }).populate('beneficiary', 'firstName lastName mobile aadhaar');
};

module.exports = mongoose.model('Fund', fundSchema);

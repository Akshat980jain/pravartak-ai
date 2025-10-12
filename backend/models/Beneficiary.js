const mongoose = require('mongoose');
const encryption = require('../utils/encryption');

const beneficiarySchema = new mongoose.Schema({
  // Personal Information
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  middleName: {
    type: String,
    trim: true,
    maxlength: [50, 'Middle name cannot exceed 50 characters']
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'Date of birth is required']
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other', 'transgender'],
    required: [true, 'Gender is required']
  },
  maritalStatus: {
    type: String,
    enum: ['single', 'married', 'divorced', 'widowed'],
    required: [true, 'Marital status is required']
  },

  // Contact Information
  email: {
    type: String,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  mobile: {
    type: String,
    required: [true, 'Mobile number is required'],
    unique: true,
    match: [/^[6-9]\d{9}$/, 'Please provide a valid 10-digit mobile number']
  },
  alternateMobile: {
    type: String,
    match: [/^[6-9]\d{9}$/, 'Please provide a valid 10-digit mobile number']
  },

  // Identity Information
  aadhaar: {
    type: String,
    required: [true, 'Aadhaar number is required'],
    unique: true,
    match: [/^\d{12}$/, 'Please provide a valid 12-digit Aadhaar number']
  },
  pan: {
    type: String,
    match: [/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Please provide a valid PAN number']
  },
  voterId: {
    type: String,
    match: [/^[A-Z]{3}[0-9]{7}$/, 'Please provide a valid Voter ID']
  },

  // Caste and Category Information
  caste: {
    type: String,
    required: [true, 'Caste is required'],
    enum: ['SC', 'ST', 'OBC', 'General']
  },
  subCaste: {
    type: String,
    trim: true
  },
  religion: {
    type: String,
    required: [true, 'Religion is required']
  },
  category: {
    type: String,
    enum: ['victim', 'dependent', 'witness'],
    required: [true, 'Category is required']
  },

  // Address Information
  permanentAddress: {
    street: {
      type: String,
      required: [true, 'Street address is required']
    },
    village: String,
    city: {
      type: String,
      required: [true, 'City is required']
    },
    district: {
      type: String,
      required: [true, 'District is required']
    },
    state: {
      type: String,
      required: [true, 'State is required']
    },
    pincode: {
      type: String,
      required: [true, 'Pincode is required'],
      match: [/^\d{6}$/, 'Please provide a valid 6-digit pincode']
    },
    country: {
      type: String,
      default: 'India'
    }
  },
  currentAddress: {
    street: String,
    village: String,
    city: String,
    district: String,
    state: String,
    pincode: {
      type: String,
      match: [/^\d{6}$/, 'Please provide a valid 6-digit pincode']
    },
    country: {
      type: String,
      default: 'India'
    },
    sameAsPermanent: {
      type: Boolean,
      default: false
    }
  },

  // Bank Information
  bankDetails: {
    accountHolderName: {
      type: String,
      required: [true, 'Account holder name is required']
    },
    accountNumber: {
      type: String,
      required: [true, 'Bank account number is required']
    },
    ifscCode: {
      type: String,
      required: [true, 'IFSC code is required'],
      match: [/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Please provide a valid IFSC code']
    },
    bankName: {
      type: String,
      required: [true, 'Bank name is required']
    },
    branchName: {
      type: String,
      required: [true, 'Branch name is required']
    },
    accountType: {
      type: String,
      enum: ['savings', 'current'],
      default: 'savings'
    }
  },

  // Case Information
  caseDetails: {
    caseNumber: {
      type: String,
      required: [true, 'Case number is required']
    },
    caseType: {
      type: String,
      enum: ['PCR', 'POA', 'other'],
      required: [true, 'Case type is required']
    },
    incidentDate: {
      type: Date,
      required: [true, 'Incident date is required']
    },
    incidentLocation: {
      type: String,
      required: [true, 'Incident location is required']
    },
    policeStation: {
      type: String,
      required: [true, 'Police station is required']
    },
    firNumber: String,
    courtName: String,
    caseStatus: {
      type: String,
      enum: ['pending', 'under_trial', 'convicted', 'acquitted', 'disposed'],
      default: 'pending'
    }
  },

  // Family Information
  familyMembers: [{
    name: {
      type: String,
      required: true
    },
    relationship: {
      type: String,
      required: true,
      enum: ['spouse', 'father', 'mother', 'son', 'daughter', 'brother', 'sister', 'other']
    },
    age: Number,
    gender: {
      type: String,
      enum: ['male', 'female', 'other']
    },
    occupation: String,
    isDependent: {
      type: Boolean,
      default: false
    }
  }],

  // Economic Information
  economicStatus: {
    annualIncome: {
      type: Number,
      required: [true, 'Annual income is required']
    },
    occupation: {
      type: String,
      required: [true, 'Occupation is required']
    },
    employmentStatus: {
      type: String,
      enum: ['employed', 'unemployed', 'self_employed', 'student', 'retired', 'housewife'],
      required: [true, 'Employment status is required']
    },
    hasDisability: {
      type: Boolean,
      default: false
    },
    disabilityType: String,
    disabilityPercentage: Number
  },

  // Application Status
  applicationStatus: {
    type: String,
    enum: ['draft', 'submitted', 'under_review', 'approved', 'rejected', 'disbursed'],
    default: 'draft'
  },
  applicationDate: {
    type: Date,
    default: Date.now
  },
  reviewDate: Date,
  approvalDate: Date,
  disbursementDate: Date,

  // DBT Information
  dbtDetails: {
    schemeName: {
      type: String,
      required: [true, 'Scheme name is required']
    },
    schemeCode: {
      type: String,
      required: [true, 'Scheme code is required']
    },
    sanctionedAmount: {
      type: Number,
      required: [true, 'Sanctioned amount is required']
    },
    disbursedAmount: {
      type: Number,
      default: 0
    },
    utrNumber: String,
    transactionId: String,
    disbursementStatus: {
      type: String,
      enum: ['pending', 'initiated', 'successful', 'failed'],
      default: 'pending'
    }
  },

  // Documents
  documents: [{
    documentType: {
      type: String,
      required: true,
      enum: ['aadhaar', 'pan', 'voter_id', 'caste_certificate', 'bank_passbook', 'case_documents', 'income_certificate', 'disability_certificate', 'other']
    },
    documentName: {
      type: String,
      required: true
    },
    documentPath: {
      type: String,
      required: true
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    verifiedAt: Date
  }],

  // Audit Fields
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  disbursedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  remarks: String,
  rejectionReason: String,

  // Status tracking
  isActive: {
    type: Boolean,
    default: true
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full name
beneficiarySchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.middleName ? this.middleName + ' ' : ''}${this.lastName}`;
});

// Virtual for age
beneficiarySchema.virtual('age').get(function() {
  if (!this.dateOfBirth) return null;
  const today = new Date();
  const birthDate = new Date(this.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
});

// Indexes
beneficiarySchema.index({ aadhaar: 1 });
beneficiarySchema.index({ mobile: 1 });
beneficiarySchema.index({ email: 1 });
beneficiarySchema.index({ applicationStatus: 1 });
beneficiarySchema.index({ 'permanentAddress.state': 1, 'permanentAddress.district': 1 });
beneficiarySchema.index({ 'dbtDetails.schemeCode': 1 });
beneficiarySchema.index({ createdAt: -1 });
beneficiarySchema.index({ createdBy: 1 });

// Pre-save middleware to encrypt sensitive data
beneficiarySchema.pre('save', function(next) {
  if (this.isModified('aadhaar') && this.aadhaar) {
    this.aadhaar = encryption.encryptAadhaar(this.aadhaar);
  }
  
  if (this.isModified('bankDetails')) {
    this.bankDetails = encryption.encryptBankDetails(this.bankDetails);
  }
  
  next();
});

// Post-find middleware to decrypt sensitive data
beneficiarySchema.post('find', function(docs) {
  docs.forEach(doc => {
    if (doc.aadhaar) {
      try {
        doc.aadhaar = encryption.decryptAadhaar(doc.aadhaar);
      } catch (error) {
        console.error('Aadhaar decryption error:', error);
      }
    }
    
    if (doc.bankDetails) {
      try {
        doc.bankDetails = encryption.decryptBankDetails(doc.bankDetails);
      } catch (error) {
        console.error('Bank details decryption error:', error);
      }
    }
  });
});

beneficiarySchema.post('findOne', function(doc) {
  if (doc) {
    if (doc.aadhaar) {
      try {
        doc.aadhaar = encryption.decryptAadhaar(doc.aadhaar);
      } catch (error) {
        console.error('Aadhaar decryption error:', error);
      }
    }
    
    if (doc.bankDetails) {
      try {
        doc.bankDetails = encryption.decryptBankDetails(doc.bankDetails);
      } catch (error) {
        console.error('Bank details decryption error:', error);
      }
    }
  }
});

// Instance methods
beneficiarySchema.methods.updateStatus = function(newStatus, userId, remarks = null) {
  this.applicationStatus = newStatus;
  
  switch (newStatus) {
    case 'under_review':
      this.reviewedBy = userId;
      this.reviewDate = new Date();
      break;
    case 'approved':
      this.approvedBy = userId;
      this.approvalDate = new Date();
      break;
    case 'disbursed':
      this.disbursedBy = userId;
      this.disbursementDate = new Date();
      break;
    case 'rejected':
      this.rejectionReason = remarks;
      break;
  }
  
  if (remarks) {
    this.remarks = remarks;
  }
  
  return this.save();
};

beneficiarySchema.methods.addDocument = function(documentData) {
  this.documents.push(documentData);
  return this.save();
};

beneficiarySchema.methods.verifyDocument = function(documentId, userId) {
  const document = this.documents.id(documentId);
  if (document) {
    document.isVerified = true;
    document.verifiedBy = userId;
    document.verifiedAt = new Date();
    return this.save();
  }
  throw new Error('Document not found');
};

module.exports = mongoose.model('Beneficiary', beneficiarySchema);

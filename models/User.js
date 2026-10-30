const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const creditCardSchema = new mongoose.Schema(
  {
    cardholderName: {
      type: String,
      required: true,
      trim: true
    },

    cardNumber: {
      type: String,
      required: true,
      trim: true,
      match: [/^\d{13,19}$/, 'Card number must contain 13 to 19 digits']
    },

    expirationMonth: {
      type: Number,
      required: true,
      min: 1,
      max: 12
    },

    expirationYear: {
      type: Number,
      required: true
    },

    billingAddress: {
      type: String,
      trim: true
    }
  },
  {
    _id: true
  }
);

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      immutable: true
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false
    },

    firstName: {
      type: String,
      trim: true
    },

    lastName: {
      type: String,
      trim: true
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      immutable: true
},
    creditCards: {
      type: [creditCardSchema],
      default: [],
      select: false
},

    homeAddress: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }

  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
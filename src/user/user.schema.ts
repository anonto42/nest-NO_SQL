import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { UserRole } from './user.enum';

@Schema({ timestamps: true })
export class User extends Document 
{

  // Personal info

  @Prop({ 
    type: String, 
    required: true 
  })
  name: string;

  @Prop({ 
    type: String, 
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: (v: string) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v),
      message: (props) => `${props.value} is not a valid email address!`,
    },
    required: true 
  })
  email: string;

  @Prop({
    type: String, 
    required: true, 
    select: false 
  })
  password: string;

  @Prop({
    type: Number,
    default: 0
   })
  age: number;

  @Prop({
    enum: UserRole,
    default: UserRole.USER
  })
  role: UserRole;

  @Prop({
    type: String,
    default: "https://i.ibb.co/z5YHLV9/profile.png"
  })
  avatar: string;


  // Auth related fields

  @Prop({
    type: Boolean,
    default: false
  })
  isVerified: boolean;

  @Prop({
    type: Number,
    default: null,
    min: [1000, 'OTP must be a 4-digit number!'],  // Minimum value for a 4-digit OTP
    max: [999999, 'OTP must be a number between 1000 and 999999!'],  // Maximum value for a 6-digit OTP
  })
  otp?: number;

  @Prop({
    type: String,
    default: null
  })
  refreshToken?: string;

  @Prop({
    type: String,
    default: null
  })
  resetPasswordToken?: string;

  @Prop({
    type: Date,
    default: null
  })
  resetPasswordTokenExpiry?: Date;


  async hashPassword(): Promise<void> 
  {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  };

  async comparePassword(enteredPassword: string): Promise<boolean> 
  {
    return await bcrypt.compare(enteredPassword, this.password);
  };

};

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    await this.hashPassword();
  }
  next();
});
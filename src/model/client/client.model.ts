
import { Schema, model } from 'mongoose';

export enum StepsEnum {
    CompanyInfo = 'companyInfo',
    ChoosePlan = 'choosePlan',
    Finish = 'finish'
}

export interface IClient {
    email: string;
    name: string;
    password: string;
    phone: string;
    steps: string;
    companies: 
        {
          type: { type: string },
          name: string,
          quantity: number,
          address: string,
          subDomain: string,
          subsidiaries: [
            {
              name: string,
              package: string,
              quantity: number,
              address: string ,
              subDomain: string,
            }
          ] // ✅ No need for `?`, Mongoose handles optional fields
        };
    connection: [
        { companyName: string, subDomain: string, db: string }
    ];
    paid: boolean;
    createdAt: number;

}

const clientSchema = new Schema<IClient>({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, 'Please use a valid email address']
    },
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters']
    },
    phone: {
        type: String,
        trim: true,
        match: [/^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/, 'Please enter a valid phone number']
    },
    steps: {
        type: String,
        enum: Object.values(StepsEnum),
    },
    companies: 
        {
          type: { type: String },
          name: String,
          quantity: Number,
          address: String,
          subDomain: String,
          subsidiaries: [
            {
              name: String,
              package: String,
              quantity: Number,
              address: String,
              subDomain: String,
            }
          ] // ✅ No need for `?`, Mongoose handles optional fields
        }
      ,
    connection: [
        { companyName: String, subDomain: String, db: String }
    ],
    paid: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Number,
        default: Date.now
    }
},);

const Client = model<IClient>('Client', clientSchema);

export default Client;

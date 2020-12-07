import { Generic } from "../core.types";
import { BillingPlan } from "./billing";
import { Student } from "../enrollment/enroll";

export enum TransactionStatus {
  PENDING = 'pending',
  DECLINED = 'declined',
  SUCCESS = 'success'
}

export default interface Transaction extends Generic{
  billing_plan: BillingPlan
  amount: number,
  student: Student
  invoice: string
  code: string
  signature: string
  status: TransactionStatus
  
}
import Context from "../../context";
import { Paginated, Pagination } from "../core.types";
import { BillingPlan } from "./billing";
import Transaction, { TransactionStatus } from "./transaction";
export default interface TransactionManager {
  create(context: Context, transaction: Transaction): Promise<void>
  fetch(context: Context, pagination: Pagination): Promise<Paginated<Transaction[]>>
  update(context: Context, invoice: string,transaction: Transaction): Promise<void>
  updateStatus(context: Context, invoice: string, status: TransactionStatus): Promise<void>

  createBillingPlan(context: Context, billingPlan: BillingPlan): Promise<BillingPlan>
  fetchPackageRelatedToCourse(context: Context, courseUUID: string): Promise<BillingPlan[]>
  fetchBillingPlanCourse(context: Context, courseUUID: string): Promise<BillingPlan>
  
}
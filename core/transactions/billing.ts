import { Generic } from "../core.types"
import Course from "../courses/course"

export enum SubscriptionType {
  ONE_TIME = 'one_time',
  SUBSCRIPTION = 'subscription',
  FREE = 'free'
}

export interface BillingPlan extends Generic{
  price: number
  subscription_type: SubscriptionType
  month_duration?: number // exist if subscription type is 'SUBSCRIPTION'
  courses: Course[]
  description: string
} 
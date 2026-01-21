/**
 * This file previously contained a checkIsPro() function that violated Clerk Billing rules.
 * 
 * Per the clerk-billing rule:
 * - All plan/feature checks MUST use the has() helper from auth()
 * - Do NOT use publicMetadata to check for plans
 * - Do NOT create custom subscription logic outside of Clerk Billing
 * 
 * Correct usage:
 * const { has } = await auth();
 * const isPro = has({ plan: 'pro' });
 * const hasFeature = has({ feature: 'unlimited_decks' });
 */

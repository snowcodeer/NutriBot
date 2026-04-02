<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of NutriBot with PostHog analytics. The project already had a strong foundation of event tracking helpers in `lib/posthog.tsx` and screen-level calls throughout the onboarding flow. The wizard upgraded the initialization to the recommended Next.js 15.3+ pattern (`instrumentation-client.ts`), removed the conflicting legacy `PostHogClientProvider`, added a EU reverse-proxy for improved data reliability, set the required environment variables, and extended event coverage to the dashboard page.

| Event | Description | File |
|---|---|---|
| `viewed_welcome_screen` | User lands on the welcome/splash screen | `app/onboarding/screens/Welcome.tsx` |
| `clicked_get_started` | User taps the Get Started CTA | `app/onboarding/screens/Welcome.tsx` |
| `viewed_goal_selection` | User reaches goal-selection step | `app/onboarding/screens/GoalSelection.tsx` |
| `selected_goal` | User picks a fitness goal (lose_weight / maintain / build_muscle) | `app/onboarding/screens/GoalSelection.tsx` |
| `viewed_body_stats` | User reaches body-stats input step | `app/onboarding/screens/BodyStats.tsx` |
| `completed_body_stats` | User submits height/weight/target-weight | `app/onboarding/screens/BodyStats.tsx` |
| `viewed_activity_level` | User reaches activity-level selection step | `app/onboarding/screens/ActivityLevel.tsx` |
| `selected_activity_level` | User picks an activity level | `app/onboarding/screens/ActivityLevel.tsx` |
| `viewed_diet_preferences` | User reaches diet preferences step | `app/onboarding/screens/DietPreferences.tsx` |
| `completed_diet_preferences` | User confirms diet restrictions | `app/onboarding/screens/DietPreferences.tsx` |
| `viewed_your_plan` | User sees their personalised calorie target | `app/onboarding/screens/YourPlan.tsx` |
| `clicked_see_my_plan` | User taps Continue on the Your Plan screen | `app/onboarding/screens/YourPlan.tsx` |
| `viewed_paywall` | User reaches the paywall | `app/onboarding/screens/Paywall.tsx` |
| `started_free_trial` | User taps Start Free Trial — highest-value conversion | `app/onboarding/screens/Paywall.tsx` |
| `clicked_lifetime_deal` | User taps the hidden Lifetime $49 button | `app/onboarding/screens/Paywall.tsx` |
| `skipped_paywall` | User taps Maybe later | `app/onboarding/screens/Paywall.tsx` |
| `completed_onboarding` | User finishes the full onboarding flow | `app/onboarding/screens/Paywall.tsx` |
| `viewed_dashboard` | User lands on the dashboard (confirms retention) | `app/dashboard/page.tsx` |
| `clicked_rerun_setup` | User taps Re-run setup on the dashboard (churn signal) | `app/dashboard/page.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard — Analytics basics**: https://eu.posthog.com/project/152381/dashboard/601653
- **Onboarding → Paywall → Conversion funnel**: https://eu.posthog.com/project/152381/insights/qWEiX65J
- **Paywall conversion rate**: https://eu.posthog.com/project/152381/insights/vfV6f0KS
- **Paywall action breakdown: trial vs lifetime vs skip**: https://eu.posthog.com/project/152381/insights/cWF7Lxxb
- **Goal selection distribution**: https://eu.posthog.com/project/152381/insights/owRjEoDq
- **Churn signal: Re-run setup clicks**: https://eu.posthog.com/project/152381/insights/JtYgN3WX

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

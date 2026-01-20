import { clerkClient } from "@clerk/nextjs/server";

export async function checkIsPro(userId: string | null | undefined, orgId?: string | null): Promise<boolean> {
    if (!userId) return false;

    try {
        const client = await clerkClient();
        const user = await client.users.getUser(userId);

        const userPlan = user.publicMetadata?.plan as string | undefined;
        if (userPlan === "pro") return true;

        if (orgId) {
            try {
                const org = await client.organizations.getOrganization({ organizationId: orgId });
                const orgPlan = org.publicMetadata?.plan as string | undefined;
                if (orgPlan === "pro") return true;
            } catch (orgError) {
                console.error("Error fetching org:", orgError);
            }
        }

        return false;
    } catch (error) {
        console.error("Error checking pro status:", error);
        return false;
    }
}



import { GameManagementTable } from "@/components/admin/game-management-table";
import { UserManagementTable } from "@/components/admin/user-management-table";
import { VideoHighlightManagementTable } from "@/components/admin/video-highlight-management-table";
import { TeamManagementTable } from "@/components/admin/team-management-table";
import { getAllGames, getAllUserProfiles, getAllVideoHighlights, getAllTeamMembers, getAllCreators, getAllFAQs } from "@/lib/data";
import type { Metadata } from 'next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Gamepad2, Users, Video, Briefcase, Sparkles, HelpCircle } from "lucide-react";
import { CreatorManagementTable } from "@/components/admin/creator-management-table";
import { FaqManagementTable } from "@/components/admin/faq-management-table";

export const revalidate = 0; // Disable caching for this page

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Manage games, users, and reviews.',
};

export default async function AdminPage() {
    const [games, users, highlights, team, creators, faqs] = await Promise.all([
      getAllGames(),
      getAllUserProfiles(),
      getAllVideoHighlights(),
      getAllTeamMembers(),
      getAllCreators(),
      getAllFAQs(),
    ]);

    return (
        <div className="container mx-auto px-4 py-12 md:px-6 lg:px-8">
            <header className="mb-8">
                <h1 className="text-4xl font-extrabold tracking-tight text-primary sm:text-5xl">Admin Dashboard</h1>
                <p className="mt-2 text-lg text-muted-foreground">
                    Welcome, Admin. Manage your platform content here.
                </p>
            </header>
            <main>
                <Tabs defaultValue="games" className="w-full">
                    <TabsList className="flex h-auto flex-wrap justify-center gap-1">
                        <TabsTrigger value="games"><Gamepad2 className="mr-2" /> Games</TabsTrigger>
                        <TabsTrigger value="highlights"><Video className="mr-2" /> Video Highlights</TabsTrigger>
                        <TabsTrigger value="users"><Users className="mr-2" /> Users</TabsTrigger>
                        <TabsTrigger value="team"><Briefcase className="mr-2" /> Team</TabsTrigger>
                        <TabsTrigger value="creators"><Sparkles className="mr-2" /> Creators</TabsTrigger>
                        <TabsTrigger value="faq"><HelpCircle className="mr-2" /> FAQ</TabsTrigger>
                    </TabsList>
                    <TabsContent value="games" className="mt-6">
                        <GameManagementTable initialGames={games} />
                    </TabsContent>
                    <TabsContent value="highlights" className="mt-6">
                        <VideoHighlightManagementTable initialHighlights={highlights} />
                    </TabsContent>
                    <TabsContent value="users" className="mt-6">
                        <UserManagementTable initialUsers={users} />
                    </TabsContent>
                     <TabsContent value="team" className="mt-6">
                        <TeamManagementTable initialMembers={team} />
                    </TabsContent>
                    <TabsContent value="creators" className="mt-6">
                        <CreatorManagementTable initialCreators={creators} />
                    </TabsContent>
                    <TabsContent value="faq" className="mt-6">
                        <FaqManagementTable initialFaqs={faqs} />
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    );
}

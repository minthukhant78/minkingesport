
"use client";

import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Clipboard } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import type { TeamMember, FAQ } from '@/lib/types';
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { Skeleton } from './ui/skeleton';

export function AboutPageContent() {
  const { toast } = useToast();
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [teamLoading, setTeamLoading] = useState(true);
  const [faqLoading, setFaqLoading] = useState(true);

  const clanCode = '#2RRP90GUV';

  const handleCopy = () => {
    navigator.clipboard.writeText(clanCode);
    toast({
      title: "Copied to clipboard!",
      description: `Clan code ${clanCode} is ready to paste.`,
    });
  };

  useEffect(() => {
    setTeamLoading(true);
    const membersCol = collection(db, 'team_members');
    const qMembers = query(membersCol, orderBy('order', 'asc'));

    const unsubscribeMembers = onSnapshot(qMembers, (querySnapshot) => {
      const members: TeamMember[] = [];
      querySnapshot.forEach((doc) => {
        members.push({ ...doc.data(), id: doc.id } as TeamMember);
      });
      setTeam(members);
      setTeamLoading(false);
    }, (error) => {
      console.error("Error fetching team members: ", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not fetch team members.",
      });
      setTeamLoading(false);
    });

    setFaqLoading(true);
    const faqsCol = collection(db, 'faqs');
    const qFaqs = query(faqsCol, orderBy('order', 'asc'));
    const unsubscribeFaqs = onSnapshot(qFaqs, (querySnapshot) => {
      const faqList: FAQ[] = [];
      querySnapshot.forEach((doc) => {
        faqList.push({ ...doc.data(), id: doc.id } as FAQ);
      });
      setFaqs(faqList);
      setFaqLoading(false);
    }, (error) => {
      console.error("Error fetching FAQs: ", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not fetch FAQs.",
      });
      setFaqLoading(false);
    });


    return () => {
      unsubscribeMembers();
      unsubscribeFaqs();
    }
  }, [toast]);

  return (
    <div className="container mx-auto px-4 py-12 md:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <section className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-primary sm:text-5xl">About MinKing Esport</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Your portal to new gaming adventures, powered by community and cutting-edge AI.
          </p>
        </section>

        <section className="mt-16">
          <Card className="overflow-hidden">
            <div className="grid md:grid-cols-2">
              <div className="relative h-64 md:h-full">
                <Image
                  src="https://images.pexels.com/photos/691668/pexels-photo-691668.jpeg"
                  alt="Our Story"
                  fill
                  className="object-cover"
                  data-ai-hint="team working office"
                />
              </div>
              <div className="p-8">
                <h2 className="text-3xl font-bold">Our Story</h2>
                <p className="mt-4 text-muted-foreground">
                  MinKing Esport ကို Mr. Min Thu Khant စတင်ဖွဲစည်းတောင်ပါတယ်။  MinKing Esport ကို ၂၀၁၈ မှစတင်ခဲ့ ပါတယ် ။ အခုဆိုရင် ဖွဲ့ဝင် ၂၀ ယောက်ဖြစ်နေပါတယ်။
                </p>
              </div>
            </div>
          </Card>
        </section>

        <section className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-8">Join Our Gaming Communities</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Clash of Clans (COC)</CardTitle>
                <CardDescription>Join our clan and let's win wars together!</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Our Clan Invite Code:</p>
                <div className="mt-2 flex items-center justify-between gap-2 rounded-md bg-secondary p-3">
                  <code className="text-lg font-mono font-bold text-secondary-foreground">{clanCode}</code>
                  <Button variant="ghost" size="icon" onClick={handleCopy} className="h-8 w-8 shrink-0">
                    <Clipboard className="h-4 w-4" />
                    <span className="sr-only">Copy code</span>
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-6 mb-2">Example Clan War Plan:</p>
                <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-secondary">
                    <iframe
                        src={"https://www.youtube.com/watch?v=Jj0HwjI8d6o"}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                        className="absolute top-0 left-0 w-full h-full"
                    ></iframe>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Mobile Legends: Bang Bang (MLBB)</CardTitle>
                <CardDescription>Team up with us and climb the ranks.</CardDescription>
              </CardHeader>
              <CardContent>
                 <p className="text-center text-muted-foreground">Our squad is always looking for new talent. Connect with us on social media!</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mt-16 text-center">
          <h2 className="text-3xl font-bold">Meet the Team</h2>
          <p className="mt-2 text-muted-foreground">The developers and designers behind MinKing Esport.</p>
          <div className="mt-8 grid grid-cols-2 gap-8 sm:grid-cols-4">
            {teamLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center">
                  <Skeleton className="h-24 w-24 rounded-full" />
                  <Skeleton className="mt-4 h-5 w-24" />
                  <Skeleton className="mt-1 h-4 w-16" />
                </div>
              ))
            ) : (
              team.map((member) => (
                <div key={member.id} className="flex flex-col items-center">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={member.avatarUrl} alt={member.name} data-ai-hint="professional headshot" />
                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <h3 className="mt-4 font-semibold">{member.name}</h3>
                  <p className="text-sm text-primary">{member.role}</p>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full">
            {faqLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="border-b py-4">
                  <Skeleton className="h-6 w-3/4" />
                </div>
              ))
            ) : (
              faqs.map((faq) => (
                <AccordionItem value={faq.id} key={faq.id}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))
            )}
          </Accordion>
        </section>

      </div>
    </div>
  );
}

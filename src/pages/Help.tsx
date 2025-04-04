
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Mail, Phone, MessageSquare, HelpCircle } from 'lucide-react';

const Help = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const faqs = [
    {
      question: 'How do I view my player stats?',
      answer: 'You can view your player stats by navigating to your player profile page. Click on your name in the leaderboard or search for your name in the players section.'
    },
    {
      question: 'How is the handicap calculated?',
      answer: 'Handicaps are calculated based on the CONGU system, taking into account your best 8 scores from your last 20 rounds. The system automatically updates your handicap after each verified round.'
    },
    {
      question: 'How do I submit a score?',
      answer: 'Scores can be submitted after a game by navigating to the games section and clicking on the specific game. Only admins can enter scores for all players. If you\'re not an admin, please submit your scorecard to an admin for entry.'
    },
    {
      question: 'What is Stableford scoring?',
      answer: 'Stableford is a scoring system where points are awarded based on the number of strokes taken at each hole relative to a fixed score (usually par plus any handicap strokes). It uses a points system with 2 points for par, 3 for birdie, 1 for bogey, etc.'
    },
    {
      question: 'How do I sign up for the next game?',
      answer: 'To sign up for the next game, navigate to the Dashboard or Games section and look for upcoming games. Click on the game and select "Sign Up". Alternatively, you can contact the organizer directly.'
    },
    {
      question: 'How do notifications work?',
      answer: 'The system sends notifications for upcoming games, score verifications, and new score submissions. You can customize your notification preferences in the Settings page.'
    },
    {
      question: 'Can I upload photos from a game?',
      answer: 'Yes! Navigate to the Photos section and click "Upload Photo". You can upload photos from your device and add captions. Photos are organized by date and game.'
    },
    {
      question: 'What is the "Swindle"?',
      answer: 'The "Swindle" is a friendly competition format where players contribute to a pot and winnings are distributed based on performance. The exact rules may vary, but typically it involves Stableford scoring with prizes for various achievements.'
    }
  ];
  
  const filteredFaqs = searchQuery 
    ? faqs.filter(faq => 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : faqs;

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Help & FAQ</h1>
        
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search for help..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Card>
          <CardHeader className="bg-golf-green text-white rounded-t-lg">
            <CardTitle>Frequently Asked Questions</CardTitle>
            <CardDescription className="text-white/80">
              Find answers to common questions about the golf swindle
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Accordion type="single" collapsible className="w-full">
              {filteredFaqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    <span className="flex items-center">
                      <HelpCircle className="mr-2 h-4 w-4 text-golf-green" />
                      {faq.question}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 py-2 text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            
            {filteredFaqs.length === 0 && (
              <div className="text-center py-6">
                <p className="text-muted-foreground">No results found for "{searchQuery}"</p>
                <p className="mt-2">Try another search term or contact support</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Still Need Help?</CardTitle>
            <CardDescription>
              Contact us using one of the methods below
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Button variant="outline" className="flex items-center justify-start space-x-2 h-auto py-4">
              <Mail className="h-5 w-5 text-golf-green" />
              <div className="text-left">
                <p className="font-medium">Email</p>
                <p className="text-sm text-muted-foreground">support@karensgolf.com</p>
              </div>
            </Button>
            
            <Button variant="outline" className="flex items-center justify-start space-x-2 h-auto py-4">
              <Phone className="h-5 w-5 text-golf-green" />
              <div className="text-left">
                <p className="font-medium">Phone</p>
                <p className="text-sm text-muted-foreground">+44 1234 567890</p>
              </div>
            </Button>
            
            <Button variant="outline" className="flex items-center justify-start space-x-2 h-auto py-4">
              <MessageSquare className="h-5 w-5 text-golf-green" />
              <div className="text-left">
                <p className="font-medium">Live Chat</p>
                <p className="text-sm text-muted-foreground">Available 9am-5pm</p>
              </div>
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Help;

import { Building2, Briefcase, Search } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Common } from "@/constants";
import { MainNav } from "@/components/main-nav";
import Footer from '@/components/footer';

const Feature: React.FC<{ title: string; description: string; icon: React.ComponentType<React.SVGProps<SVGSVGElement>> }> = ({ title, description, icon: Icon }) => {
  return (
    <Card className="w-full h-full transition-all hover:shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center text-lg sm:text-xl">
          <Icon className="w-5 h-5 sm:w-6 sm:h-6 mr-2 flex-shrink-0 text-primary" />
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-sm sm:text-base">{description}</CardDescription>
      </CardContent>
    </Card>
  )
}

export default function Home() {
  return (
    <>
      <MainNav />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto space-y-12">
          {/* Hero section */}
          <div className="text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Find Your Next Career Opportunity
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              {Common.tagline}
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Link href="/jobs">
                <Button size="lg" className="gap-2">
                  <Search className="h-5 w-5" />
                  Browse Jobs
                </Button>
              </Link>
              <Link href="/jobs/post">
                <Button size="lg" variant="outline" className="gap-2">
                  <Briefcase className="h-5 w-5" />
                  Post a Job
                </Button>
              </Link>
            </div>
          </div>

          {/* Features section */}
          <div className="py-12">
            <h2 className="text-3xl font-bold text-center mb-8">Why Use {Common.title}?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Feature
                title="Easy Job Search"
                description="Find relevant job opportunities quickly with our powerful search and filtering tools."
                icon={Search}
              />
              <Feature
                title="Post Jobs Easily"
                description="Employers can post job listings in minutes and reach qualified candidates."
                icon={Briefcase}
              />
              <Feature
                title="Company Profiles"
                description="Learn about potential employers and their company culture before applying."
                icon={Building2}
              />
            </div>
          </div>

          {/* CTA section */}
          <div className="bg-muted rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to find your dream job?</h2>
            <p className="text-muted-foreground mb-6">Join thousands of job seekers who found their next opportunity on {Common.title}.</p>
            <Link href="/jobs">
              <Button size="lg">Get Started Now</Button>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

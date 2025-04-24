"use client";

import Link from "next/link";
import { Mail, MapPin, Instagram, Facebook, Twitter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function ContactPage() {
  return (
    <div className="bg-landa-cream min-h-screen w-full">
      <main className="max-w-2xl mx-auto px-4 py-16 space-y-10">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Contact Us</h1>
          <p className="text-muted-foreground text-lg">
            Got questions, suggestions, or just want to say hi? We're here for
            you.
          </p>
        </div>

        <div className="grid gap-6">
          {/* Email Card */}
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <Mail className="text-landa-green" />
              <CardTitle>Email</CardTitle>
            </CardHeader>
            <CardContent>
              <a
                href="mailto:info@landa.pk"
                className="text-landa-green underline text-sm"
              >
                info@landa.pk
              </a>
            </CardContent>
          </Card>

          {/* Location Card */}
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <MapPin className="text-landa-green" />
              <CardTitle>Location</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Islamabad, Pakistan
              </p>
            </CardContent>
          </Card>
        </div>

        <Separator className="my-6" />

        {/* Social Media */}
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">
            Connect with us on social media:
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="#"
              aria-label="Instagram"
              className="hover:text-landa-green transition-colors"
            >
              <Instagram />
            </a>
            <a
              href="#"
              aria-label="Facebook"
              className="hover:text-landa-green transition-colors"
            >
              <Facebook />
            </a>
            <a
              href="#"
              aria-label="Twitter"
              className="hover:text-landa-green transition-colors"
            >
              <Twitter />
            </a>
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center pt-8">
          <Link href="/products">
            <Button className="bg-landa-green bg-whi hover:bg-landa-darkgreen text-white px-6 py-2 text-sm font-medium rounded-md">
              Shop Now
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}

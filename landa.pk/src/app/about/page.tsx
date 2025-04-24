"use client";

import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MissionStatement } from "@/components/animatedmission";
export default function AboutPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-16 space-y-12">
      {/* Logo + Heading */}
      <div className="flex flex-col items-center text-center gap-4">
        <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center shadow-sm">
          <Image
            src="/placeholder.svg"
            alt="Landa Logo"
            width={64}
            height={64}
            className="object-contain"
          />
        </div>
        <h1 className="text-3xl font-bold mb-2">About Landa</h1>
        <MissionStatement />
      </div>

      {/* About Text */}
      <div className="space-y-6 text-center">
        <p className="text-muted-foreground text-lg">
          <span className="font-semibold text-foreground">Landa</span> is an
          online thrift store and marketplace founded by{" "}
          <span className="font-semibold">Tabish Noman Khan</span>,{" "}
          <span className="font-semibold">Aoun Jee</span>, and{" "}
          <span className="font-semibold">Hasnain Ali Arshad</span> to make
          fashion more sustainable, affordable, and accessible.
        </p>
        <p className="text-muted-foreground">
          We provide a platform where anyone can buy, sell, or thrift quality
          second-hand fashion items. Whether you're refreshing your wardrobe or
          giving your pre-loved clothes a second life, Landa is the go-to
          destination.
        </p>
        <p className="text-muted-foreground">
          <span className="font-semibold">What sets us apart?</span> Landa is
          created by students for students and the wider community. We focus on
          building trust, ease of use, and a vibrant local thrift culture.
        </p>
      </div>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link href="/products">
          <Button className="bg-landa-green hover:bg-landa-darkgreen text-white">
            Shop Now
          </Button>
        </Link>
        <Link href="/contact">
          <Button
            variant="outline"
            className="border-landa-green text-landa-green"
          >
            Contact Us
          </Button>
        </Link>
      </div>

      <Separator className="my-8" />

      {/* Contact & Location Card */}
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center font-semibold text-lg">
          Contact & Location
        </CardHeader>
        <CardContent className="space-y-4 text-center text-muted-foreground">
          <div className="flex items-center justify-center gap-2">
            <Mail className="text-landa-green" size={18} />
            <a href="mailto:info@landa.pk" className="underline">
              info@landa.pk
            </a>
          </div>
          <div className="flex items-center justify-center gap-2">
            <MapPin className="text-landa-green" size={18} />
            <p>Islamabad, Pakistan</p>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="text-center text-xs text-gray-400 mt-12">
        &copy; {new Date().getFullYear()} Landa. All rights reserved.
      </div>
    </main>
  );
}

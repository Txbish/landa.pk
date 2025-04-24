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
    <div className="bg-landa-cream min-h-screen w-full">
      <main className="max-w-3xl mx-auto px-6 py-16 space-y-12">
        {/* Logo + Heading */}
        <div className="flex flex-col items-center text-center gap-6">
          <div className="w-28 h-28 rounded-full bg-muted flex items-center justify-center shadow-lg">
            <Image
              src="/logo.webp"
              alt="Landa Logo"
              fill
              className="object-contain rounded-full"
            />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-800 mb-2">
            About Landa
          </h1>
          <MissionStatement />
        </div>

        {/* About Text */}
        <div className="space-y-6 text-center text-lg text-muted-foreground">
          <p>
            <span className="font-semibold text-gray-800">Landa</span> is an
            online thrift store and marketplace founded by{" "}
            <span className="font-semibold">Tabish Noman Khan</span>,{" "}
            <span className="font-semibold">Aoun Jee</span>, and{" "}
            <span className="font-semibold">Hasnain Ali Arshad</span> to make
            fashion more sustainable, affordable, and accessible.
          </p>
          <p>
            We provide a platform where anyone can buy, sell, or thrift quality
            second-hand fashion items. Whether you're refreshing your wardrobe
            or giving your pre-loved clothes a second life, Landa is the go-to
            destination.
          </p>
          <p>
            <span className="font-semibold text-gray-800">
              What sets us apart?
            </span>{" "}
            Landa is created by students for students and the wider community.
            We focus on building trust, ease of use, and a vibrant local thrift
            culture.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <Link href="/products">
            <Button className="bg-landa-green hover:bg-landa-darkgreen text-white w-full sm:w-auto">
              Shop Now
            </Button>
          </Link>
          <Link href="/contact">
            <Button
              variant="outline"
              className="border-landa-green text-landa-green w-full sm:w-auto"
            >
              Contact Us
            </Button>
          </Link>
        </div>

        <Separator className="my-8" />

        {/* Contact & Location Card */}
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center font-semibold text-lg text-gray-800">
            Contact & Location
          </CardHeader>
          <CardContent className="space-y-4 text-center text-muted-foreground">
            <div className="flex items-center justify-center gap-3">
              <Mail className="text-landa-green" size={20} />
              <a
                href="mailto:info@landa.pk"
                className="underline text-landa-green hover:text-landa-darkgreen"
              >
                info@landa.pk
              </a>
            </div>
            <div className="flex items-center justify-center gap-3">
              <MapPin className="text-landa-green" size={20} />
              <p>Islamabad, Pakistan</p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-xs text-gray-400 mt-12">
          &copy; {new Date().getFullYear()} Landa. All rights reserved.
        </div>
      </main>
    </div>
  );
}

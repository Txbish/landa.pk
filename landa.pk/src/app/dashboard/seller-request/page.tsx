"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Store } from "lucide-react";

export default function SellerRequestPage() {
  const { user, isLoading, sellerRequest, submitSellerRequest } = useAuth();
  const [formData, setFormData] = useState({
    businessName: "",
    reason: "",
  });
  const [errors, setErrors] = useState({
    businessName: "",
    reason: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fetchingRequest, setFetchingRequest] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchSellerRequest = async () => {
      try {
        // In a real app, you would fetch from your API
        // const response = await fetch('/api/seller-requests/me')
        // const data = await response.json()
        // if (data.sellerRequest) {
        //   setSellerRequest(data.sellerRequest)
        // }

        // For demo purposes, we'll simulate a delay
        setTimeout(() => {
          setFetchingRequest(false);
        }, 1000);
      } catch (error) {
        console.error("Failed to fetch seller request:", error);
        setFetchingRequest(false);
      }
    };

    if (user && user.role === "user") {
      fetchSellerRequest();
    } else {
      setFetchingRequest(false);
    }
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { ...errors };

    if (!formData.businessName.trim()) {
      newErrors.businessName = "Business name is required";
      valid = false;
    }

    if (!formData.reason.trim()) {
      newErrors.reason = "Reason is required";
      valid = false;
    } else if (formData.reason.trim().length < 20) {
      newErrors.reason =
        "Please provide a more detailed reason (at least 20 characters)";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      await submitSellerRequest(formData.businessName, formData.reason);
      showToast(
        "Your seller request has been submitted successfully",
        "success",
        "Request Submitted"
      );
    } catch (error) {
      console.error("Failed to submit seller request:", error);
      showToast(
        "Failed to submit your seller request. Please try again.",
        "error",
        "Submission failed"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || fetchingRequest) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If user is already a seller
  if (user?.role === "seller") {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <h1 className="text-2xl font-bold">Seller Dashboard</h1>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Store className="h-16 w-16 text-primary" />
            <h2 className="mt-4 text-xl font-semibold">You are a seller!</h2>
            <p className="mt-2 text-center text-muted-foreground">
              You already have seller privileges. You can manage your products
              and orders from the seller dashboard.
            </p>
            <Button className="mt-6">Go to Seller Dashboard</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If user has a pending seller request
  if (sellerRequest) {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <h1 className="text-2xl font-bold">Seller Request</h1>
        <Card>
          <CardHeader>
            <CardTitle>Seller Application Status</CardTitle>
            <CardDescription>
              Your request to become a seller is being processed
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-center">
              <Badge
                className={
                  sellerRequest.status === "Pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : sellerRequest.status === "Approved"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }
              >
                {sellerRequest.status}
              </Badge>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Business Name
                </h3>
                <p className="text-base">{sellerRequest.businessName}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Reason for Application
                </h3>
                <p className="text-base">{sellerRequest.reason}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Submitted On
                </h3>
                <p className="text-base">
                  {new Date(
                    sellerRequest.createdAt || Date.now()
                  ).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            {sellerRequest.status === "Pending" && (
              <p className="text-sm text-muted-foreground">
                Your application is currently under review. We'll notify you
                once a decision has been made.
              </p>
            )}
            {sellerRequest.status === "Approved" && (
              <div className="w-full">
                <p className="text-sm text-green-600 mb-4">
                  Congratulations! Your seller application has been approved.
                  You can now access the seller dashboard.
                </p>
                <Button className="w-full">Go to Seller Dashboard</Button>
              </div>
            )}
            {sellerRequest.status === "Rejected" && (
              <p className="text-sm text-red-600">
                Unfortunately, your seller application has been rejected. Please
                contact support for more information.
              </p>
            )}
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Default view - user can submit a seller request
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold">Become a Seller</h1>

      <Card>
        <CardHeader>
          <CardTitle>Seller Application</CardTitle>
          <CardDescription>
            Fill out the form below to apply for seller privileges on our
            platform
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="businessName">Business Name</Label>
              <Input
                id="businessName"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                placeholder="Your business name"
              />
              {errors.businessName && (
                <p className="text-sm text-destructive">
                  {errors.businessName}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">
                Why do you want to become a seller on our platform?
              </Label>
              <Textarea
                id="reason"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                placeholder="Explain your reasons for wanting to become a seller..."
                rows={5}
              />
              {errors.reason && (
                <p className="text-sm text-destructive">{errors.reason}</p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Submit Application
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

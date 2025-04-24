"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
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
import { toast } from "sonner";
import { Loader2, Store } from "lucide-react";
import {
  fetchUserSellerRequest,
  submitSellerRequest,
} from "@/services/sellerRequestService";
import { SellerRequest } from "@/lib/types";

export default function SellerRequestPage() {
  const { user, loading } = useAuth();
  const [sellerRequest, setSellerRequest] = useState<SellerRequest | null>(
    null
  );
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

  useEffect(() => {
    const fetchSellerRequestData = async () => {
      try {
        const data = await fetchUserSellerRequest();
        setSellerRequest(data);
      } catch (error) {
        setSellerRequest(null);
      } finally {
        setFetchingRequest(false);
      }
    };

    if (user) {
      fetchSellerRequestData();
    } else {
      setFetchingRequest(false);
    }
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
      const newRequest = await submitSellerRequest(
        formData.businessName,
        formData.reason
      );
      setSellerRequest(newRequest);
      toast.success("Your seller request has been submitted successfully", {
        description: "Request Submitted",
      });
    } catch (error: any) {
      if (
        error.response?.status === 400 &&
        error.response?.data?.message?.includes("already exists")
      ) {
        toast.error("You already have a pending seller request.");
      } else {
        toast.error("Failed to submit your seller request. Please try again.", {
          description: "Submission failed",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || fetchingRequest) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

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

  // Show status if request is pending or approved
  if (sellerRequest && sellerRequest.status !== "Rejected") {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <h1 className="text-2xl font-bold">Seller Request</h1>
        <Card>
          <CardHeader>
            <CardTitle>Seller Application Status</CardTitle>
            <CardDescription>
              {sellerRequest.status === "Pending"
                ? "Your request is under review. Not approved yet by admin."
                : "Your request has been approved!"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-center">
              <Badge
                className={
                  sellerRequest.status === "Pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-green-100 text-green-800"
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
                  {new Date(sellerRequest.createdAt).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            {sellerRequest.status === "Pending" && (
              <p className="text-sm text-muted-foreground">
                Your application is currently under review. Not approved yet by
                admin.
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
          </CardFooter>
        </Card>
      </div>
    );
  }

  // If rejected or no request, show the form (allow re-apply)
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold">Become a Seller</h1>
      {sellerRequest && sellerRequest.status === "Rejected" && (
        <Card className="mb-6">
          <CardContent className="py-6">
            <div className="flex flex-col items-center">
              <Badge className="bg-red-100 text-red-800 mb-2">Rejected</Badge>
              <p className="text-red-600 text-center">
                Your previous seller application was rejected. You can apply
                again below.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
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

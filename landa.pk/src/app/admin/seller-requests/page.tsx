"use client";

import { useState, useEffect } from "react";
import {
  MoreHorizontal,
  Search,
  CheckCircle,
  XCircle,
  Eye,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  fetchAllSellerRequests,
  handleSellerRequest,
} from "@/services/sellerRequestService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function SellerRequestsPage() {
  const router = useRouter();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [filteredRequests, setFilteredRequests] = useState<any[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const data = await fetchAllSellerRequests();
        setRequests(data || []);
        setFilteredRequests(data || []);
      } catch (error) {
        console.error("Error fetching seller requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  useEffect(() => {
    let filtered = [...requests];

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((request) => request.status === statusFilter);
    }

    // Apply search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (request) =>
          request.user?.name?.toLowerCase().includes(search) ||
          request.user?.email?.toLowerCase().includes(search) ||
          request.businessName?.toLowerCase().includes(search)
      );
    }

    setFilteredRequests(filtered);
  }, [requests, statusFilter, searchTerm]);

  const handleApproveRequest = async (id: string) => {
    try {
      const updatedRequest = await handleSellerRequest(id, "Approved");
      setRequests(
        requests.map((req) => (req._id === id ? updatedRequest : req))
      );
      if (selectedRequest?._id === id) {
        setSelectedRequest(updatedRequest);
      }
    } catch (error) {
      console.error("Error approving request:", error);
    }
  };

  const handleRejectRequest = async (id: string) => {
    try {
      const updatedRequest = await handleSellerRequest(id, "Rejected");
      setRequests(
        requests.map((req) => (req._id === id ? updatedRequest : req))
      );
      if (selectedRequest?._id === id) {
        setSelectedRequest(updatedRequest);
      }
    } catch (error) {
      console.error("Error rejecting request:", error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Approved":
        return <Badge className="bg-green-500">Approved</Badge>;
      case "Rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return (
          <Badge
            variant="outline"
            className="border-yellow-500 text-yellow-500"
          >
            Pending
          </Badge>
        );
    }
  };

  const viewRequestDetails = (request: any) => {
    setSelectedRequest(request);
    setDetailsOpen(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Seller Requests</h1>
        <p className="text-muted-foreground">Manage seller applications.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Seller Request List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col gap-4 md:flex-row">
            <div className="flex w-full max-w-sm items-center space-x-2">
              <Input
                placeholder="Search by name, email or business name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button type="submit">
                <Search className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Requests</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {loading ? (
            <div className="flex h-40 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Business Name</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRequests.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          No seller requests found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredRequests.map((request) => (
                        <TableRow key={request._id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">
                                {request.user?.name || "Unknown"}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {request.user?.email || "No email"}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{request.businessName}</TableCell>
                          <TableCell>
                            {request.createdAt
                              ? format(
                                  new Date(request.createdAt),
                                  "MMM dd, yyyy"
                                )
                              : "N/A"}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              {getStatusBadge(request.status)}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <span className="sr-only">Open menu</span>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem
                                  onClick={() => viewRequestDetails(request)}
                                >
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                {request.status === "Pending" && (
                                  <>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleApproveRequest(request._id)
                                      }
                                    >
                                      <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                                      Approve
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleRejectRequest(request._id)
                                      }
                                    >
                                      <XCircle className="mr-2 h-4 w-4 text-red-500" />
                                      Reject
                                    </DropdownMenuItem>
                                  </>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Seller Request Details</DialogTitle>
            <DialogDescription>
              Review the seller application details.
            </DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium">Applicant</h3>
                <p>{selectedRequest.user?.name || "Unknown"}</p>
                <p className="text-sm text-muted-foreground">
                  {selectedRequest.user?.email || "No email"}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium">Business Name</h3>
                <p>{selectedRequest.businessName}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium">Reason for Application</h3>
                <p className="whitespace-pre-line">{selectedRequest.reason}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium">Status</h3>
                <div className="mt-1">
                  {getStatusBadge(selectedRequest.status)}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium">Date Applied</h3>
                <p>
                  {selectedRequest.createdAt
                    ? format(
                        new Date(selectedRequest.createdAt),
                        "MMMM dd, yyyy"
                      )
                    : "N/A"}
                </p>
              </div>
              {selectedRequest.status === "Pending" && (
                <div className="flex space-x-2 pt-4">
                  <Button
                    className="flex-1 bg-green-500 hover:bg-green-600"
                    onClick={() => {
                      handleApproveRequest(selectedRequest._id);
                      setDetailsOpen(false);
                    }}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Approve
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() => {
                      handleRejectRequest(selectedRequest._id);
                      setDetailsOpen(false);
                    }}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Reject
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

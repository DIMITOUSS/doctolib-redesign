"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Star, ThumbsUp, ThumbsDown, Flag, Search } from "lucide-react"

export function ReviewsSystem() {
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [rating, setRating] = useState(0)
  const [reviewText, setReviewText] = useState("")

  const reviews = [
    {
      id: 1,
      patientName: "Ahmed B.",
      date: "2023-11-01",
      rating: 5,
      verified: true,
      content:
        "Dr. Dahmani is an excellent cardiologist. He took the time to explain my condition in detail and answered all my questions. The treatment he prescribed has significantly improved my health.",
      helpful: 12,
      doctorName: "Dr. Bilal Dahmani",
      specialty: "Cardiology",
    },
    {
      id: 2,
      patientName: "Fatima Z.",
      date: "2023-10-15",
      rating: 4,
      verified: true,
      content:
        "Dr. Khelifi was very professional and knowledgeable. The clinic was clean and the staff was friendly. I would recommend her to anyone looking for a dermatologist.",
      helpful: 8,
      doctorName: "Dr. Samira Khelifi",
      specialty: "Dermatology",
    },
    {
      id: 3,
      patientName: "Omar K.",
      date: "2023-09-22",
      rating: 3,
      verified: true,
      content:
        "Dr. Benali was good but the wait time was too long. The appointment was scheduled for 10:00 AM but I wasn't seen until 11:30 AM. The treatment was effective though.",
      helpful: 5,
      doctorName: "Dr. Mohamed Benali",
      specialty: "General Medicine",
    },
    {
      id: 4,
      patientName: "Leila B.",
      date: "2023-08-10",
      rating: 5,
      verified: true,
      content:
        "I had a telehealth consultation with Dr. Dahmani and it was very convenient. He was attentive and provided clear instructions for my medication. Highly recommended!",
      helpful: 10,
      doctorName: "Dr. Bilal Dahmani",
      specialty: "Cardiology",
    },
  ]

  const filteredReviews = reviews
    .filter((review) => {
      if (activeTab === "all") return true
      if (activeTab === "positive") return review.rating >= 4
      if (activeTab === "neutral") return review.rating === 3
      if (activeTab === "negative") return review.rating <= 2
      return true
    })
    .filter((review) => {
      if (!searchQuery) return true
      return (
        review.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.specialty.toLowerCase().includes(searchQuery.toLowerCase())
      )
    })

  const renderStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => <Star key={i} className={`h-4 w-4 ${i < rating ? "fill-primary text-primary" : "text-muted"}`} />)
  }

  const handleRatingClick = (value: number) => {
    setRating(value)
  }

  const handleSubmitReview = () => {
    // In a real app, this would submit the review to the backend
    console.log({ rating, reviewText })
    setRating(0)
    setReviewText("")
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Reviews & Ratings</h2>
        <p className="text-muted-foreground">Read and write reviews for doctors and healthcare providers</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-3/4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Patient Reviews</CardTitle>
                <CardDescription>{filteredReviews.length} reviews from verified patients</CardDescription>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>Write a Review</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Write a Review</DialogTitle>
                    <DialogDescription>Share your experience with a doctor or healthcare provider</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Doctor</label>
                      <Input placeholder="Search for a doctor" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Rating</label>
                      <div className="flex space-x-1">
                        {Array(5)
                          .fill(0)
                          .map((_, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => handleRatingClick(i + 1)}
                              className="focus:outline-none"
                            >
                              <Star className={`h-6 w-6 ${i < rating ? "fill-primary text-primary" : "text-muted"}`} />
                            </button>
                          ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Your Review</label>
                      <Textarea
                        placeholder="Share your experience with this doctor..."
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        className="min-h-[100px]"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleSubmitReview}>Submit Review</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
                  <div className="flex items-center justify-between">
                    <TabsList>
                      <TabsTrigger value="all">All Reviews</TabsTrigger>
                      <TabsTrigger value="positive">Positive</TabsTrigger>
                      <TabsTrigger value="neutral">Neutral</TabsTrigger>
                      <TabsTrigger value="negative">Negative</TabsTrigger>
                    </TabsList>
                    <div className="relative w-64">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search reviews..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>

                  <TabsContent value="all" className="mt-4">
                    <div className="space-y-4">
                      {filteredReviews.map((review) => (
                        <Card key={review.id}>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex items-start space-x-4">
                                <Avatar className="h-10 w-10">
                                  <AvatarFallback>{review.patientName.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="flex items-center space-x-2">
                                    <h4 className="font-medium">{review.patientName}</h4>
                                    {review.verified && (
                                      <Badge variant="outline" className="text-xs">
                                        Verified Patient
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-sm text-muted-foreground">
                                    Review for {review.doctorName} • {review.specialty}
                                  </p>
                                  <div className="flex items-center mt-1 space-x-1">
                                    {renderStars(review.rating)}
                                    <span className="ml-2 text-sm text-muted-foreground">
                                      {new Date(review.date).toLocaleDateString()}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <p className="mt-4">{review.content}</p>
                            <div className="mt-4 flex items-center space-x-4">
                              <Button variant="ghost" size="sm" className="text-muted-foreground">
                                <ThumbsUp className="mr-1 h-4 w-4" />
                                Helpful ({review.helpful})
                              </Button>
                              <Button variant="ghost" size="sm" className="text-muted-foreground">
                                <ThumbsDown className="mr-1 h-4 w-4" />
                                Not Helpful
                              </Button>
                              <Button variant="ghost" size="sm" className="text-muted-foreground">
                                <Flag className="mr-1 h-4 w-4" />
                                Report
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="positive" className="mt-4">
                    <div className="space-y-4">
                      {filteredReviews.map((review) => (
                        <Card key={review.id}>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex items-start space-x-4">
                                <Avatar className="h-10 w-10">
                                  <AvatarFallback>{review.patientName.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="flex items-center space-x-2">
                                    <h4 className="font-medium">{review.patientName}</h4>
                                    {review.verified && (
                                      <Badge variant="outline" className="text-xs">
                                        Verified Patient
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-sm text-muted-foreground">
                                    Review for {review.doctorName} • {review.specialty}
                                  </p>
                                  <div className="flex items-center mt-1 space-x-1">
                                    {renderStars(review.rating)}
                                    <span className="ml-2 text-sm text-muted-foreground">
                                      {new Date(review.date).toLocaleDateString()}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <p className="mt-4">{review.content}</p>
                            <div className="mt-4 flex items-center space-x-4">
                              <Button variant="ghost" size="sm" className="text-muted-foreground">
                                <ThumbsUp className="mr-1 h-4 w-4" />
                                Helpful ({review.helpful})
                              </Button>
                              <Button variant="ghost" size="sm" className="text-muted-foreground">
                                <ThumbsDown className="mr-1 h-4 w-4" />
                                Not Helpful
                              </Button>
                              <Button variant="ghost" size="sm" className="text-muted-foreground">
                                <Flag className="mr-1 h-4 w-4" />
                                Report
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="neutral" className="mt-4">
                    <div className="space-y-4">
                      {filteredReviews.map((review) => (
                        <Card key={review.id}>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex items-start space-x-4">
                                <Avatar className="h-10 w-10">
                                  <AvatarFallback>{review.patientName.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="flex items-center space-x-2">
                                    <h4 className="font-medium">{review.patientName}</h4>
                                    {review.verified && (
                                      <Badge variant="outline" className="text-xs">
                                        Verified Patient
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-sm text-muted-foreground">
                                    Review for {review.doctorName} • {review.specialty}
                                  </p>
                                  <div className="flex items-center mt-1 space-x-1">
                                    {renderStars(review.rating)}
                                    <span className="ml-2 text-sm text-muted-foreground">
                                      {new Date(review.date).toLocaleDateString()}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <p className="mt-4">{review.content}</p>
                            <div className="mt-4 flex items-center space-x-4">
                              <Button variant="ghost" size="sm" className="text-muted-foreground">
                                <ThumbsUp className="mr-1 h-4 w-4" />
                                Helpful ({review.helpful})
                              </Button>
                              <Button variant="ghost" size="sm" className="text-muted-foreground">
                                <ThumbsDown className="mr-1 h-4 w-4" />
                                Not Helpful
                              </Button>
                              <Button variant="ghost" size="sm" className="text-muted-foreground">
                                <Flag className="mr-1 h-4 w-4" />
                                Report
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="negative" className="mt-4">
                    <div className="space-y-4">
                      {filteredReviews.map((review) => (
                        <Card key={review.id}>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex items-start space-x-4">
                                <Avatar className="h-10 w-10">
                                  <AvatarFallback>{review.patientName.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="flex items-center space-x-2">
                                    <h4 className="font-medium">{review.patientName}</h4>
                                    {review.verified && (
                                      <Badge variant="outline" className="text-xs">
                                        Verified Patient
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-sm text-muted-foreground">
                                    Review for {review.doctorName} • {review.specialty}
                                  </p>
                                  <div className="flex items-center mt-1 space-x-1">
                                    {renderStars(review.rating)}
                                    <span className="ml-2 text-sm text-muted-foreground">
                                      {new Date(review.date).toLocaleDateString()}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <p className="mt-4">{review.content}</p>
                            <div className="mt-4 flex items-center space-x-4">
                              <Button variant="ghost" size="sm" className="text-muted-foreground">
                                <ThumbsUp className="mr-1 h-4 w-4" />
                                Helpful ({review.helpful})
                              </Button>
                              <Button variant="ghost" size="sm" className="text-muted-foreground">
                                <ThumbsDown className="mr-1 h-4 w-4" />
                                Not Helpful
                              </Button>
                              <Button variant="ghost" size="sm" className="text-muted-foreground">
                                <Flag className="mr-1 h-4 w-4" />
                                Report
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex justify-between w-full">
                <Button variant="outline" disabled>
                  Previous
                </Button>
                <Button variant="outline">Next</Button>
              </div>
            </CardFooter>
          </Card>
        </div>

        <div className="md:w-1/4">
          <Card>
            <CardHeader>
              <CardTitle>Rating Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {renderStars(5)}
                    <span className="ml-2">5 Stars</span>
                  </div>
                  <span>2</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {renderStars(4)}
                    <span className="ml-2">4 Stars</span>
                  </div>
                  <span>1</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {renderStars(3)}
                    <span className="ml-2">3 Stars</span>
                  </div>
                  <span>1</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {renderStars(2)}
                    <span className="ml-2">2 Stars</span>
                  </div>
                  <span>0</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {renderStars(1)}
                    <span className="ml-2">1 Star</span>
                  </div>
                  <span>0</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t">
                <h4 className="font-medium mb-2">Average Rating</h4>
                <div className="flex items-center">
                  <div className="flex items-center">{renderStars(4)}</div>
                  <span className="ml-2 font-bold">4.25</span>
                  <span className="ml-2 text-sm text-muted-foreground">out of 5</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">Based on 4 reviews</p>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Top Rated Doctors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>BD</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium">Dr. Bilal Dahmani</h4>
                    <p className="text-sm text-muted-foreground">Cardiology</p>
                    <div className="flex items-center mt-1">
                      {renderStars(5)}
                      <span className="ml-2 text-sm">(12 reviews)</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>SK</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium">Dr. Samira Khelifi</h4>
                    <p className="text-sm text-muted-foreground">Dermatology</p>
                    <div className="flex items-center mt-1">
                      {renderStars(4)}
                      <span className="ml-2 text-sm">(8 reviews)</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>MB</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium">Dr. Mohamed Benali</h4>
                    <p className="text-sm text-muted-foreground">General Medicine</p>
                    <div className="flex items-center mt-1">
                      {renderStars(3)}
                      <span className="ml-2 text-sm">(5 reviews)</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}


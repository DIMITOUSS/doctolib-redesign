"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Wallet, CreditCardIcon, Check, AlertCircle } from "lucide-react"

export function PaymentIntegration() {
  const [paymentMethod, setPaymentMethod] = useState("credit-card")
  const [cardNumber, setCardNumber] = useState("")
  const [cardName, setCardName] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [cvv, setCvv] = useState("")
  const [saveCard, setSaveCard] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isError, setIsError] = useState(false)

  const handlePayment = () => {
    setIsProcessing(true)

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false)

      // Simulate success (in a real app, this would depend on the payment gateway response)
      if (cardNumber && cardName && expiryDate && cvv) {
        setIsSuccess(true)
      } else {
        setIsError(true)
      }
    }, 2000)
  }

  const resetPaymentState = () => {
    setIsSuccess(false)
    setIsError(false)
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(" ")
    } else {
      return value
    }
  }

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCardNumber(e.target.value)
    setCardNumber(formattedValue)
    resetPaymentState()
  }

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "")

    if (value.length > 2) {
      value = value.substring(0, 2) + "/" + value.substring(2, 4)
    }

    setExpiryDate(value)
    resetPaymentState()
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Payment</h2>
        <p className="text-muted-foreground">Securely pay for your medical services</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
              <CardDescription>Choose your preferred payment method</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue={paymentMethod} onValueChange={setPaymentMethod}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="credit-card">
                    <CreditCardIcon className="mr-2 h-4 w-4" />
                    Credit Card
                  </TabsTrigger>
                  <TabsTrigger value="mobile-payment">
                    <Wallet className="mr-2 h-4 w-4" />
                    Mobile Payment
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="credit-card" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="card-number">Card Number</Label>
                    <Input
                      id="card-number"
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      maxLength={19}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="card-name">Cardholder Name</Label>
                    <Input
                      id="card-name"
                      placeholder="John Doe"
                      value={cardName}
                      onChange={(e) => {
                        setCardName(e.target.value)
                        resetPaymentState()
                      }}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry-date">Expiry Date</Label>
                      <Input
                        id="expiry-date"
                        placeholder="MM/YY"
                        value={expiryDate}
                        onChange={handleExpiryDateChange}
                        maxLength={5}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        value={cvv}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "")
                          setCvv(value)
                          resetPaymentState()
                        }}
                        maxLength={3}
                        type="password"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 pt-2">
                    <Checkbox id="save-card" checked={saveCard} onCheckedChange={(checked) => setSaveCard(!!checked)} />
                    <Label htmlFor="save-card">Save card for future payments</Label>
                  </div>
                </TabsContent>

                <TabsContent value="mobile-payment" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label>Select Mobile Payment Method</Label>
                    <RadioGroup defaultValue="edahabia">
                      <div className="flex items-center space-x-2 border rounded-md p-3">
                        <RadioGroupItem value="edahabia" id="edahabia" />
                        <Label htmlFor="edahabia" className="flex items-center">
                          <div className="h-8 w-12 bg-primary/10 rounded-md flex items-center justify-center mr-2">
                            <span className="text-xs font-bold text-primary">E</span>
                          </div>
                          Edahabia
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 border rounded-md p-3">
                        <RadioGroupItem value="cib" id="cib" />
                        <Label htmlFor="cib" className="flex items-center">
                          <div className="h-8 w-12 bg-primary/10 rounded-md flex items-center justify-center mr-2">
                            <span className="text-xs font-bold text-primary">CIB</span>
                          </div>
                          CIB
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 border rounded-md p-3">
                        <RadioGroupItem value="baridi-mob" id="baridi-mob" />
                        <Label htmlFor="baridi-mob" className="flex items-center">
                          <div className="h-8 w-12 bg-primary/10 rounded-md flex items-center justify-center mr-2">
                            <span className="text-xs font-bold text-primary">BM</span>
                          </div>
                          BaridiMob
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone-number">Phone Number</Label>
                    <Input id="phone-number" placeholder="+213 555 123 456" />
                  </div>
                </TabsContent>
              </Tabs>

              {isSuccess && (
                <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-md flex items-center">
                  <Check className="h-5 w-5 mr-2" />
                  Payment successful! Your appointment has been confirmed.
                </div>
              )}

              {isError && (
                <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  Payment failed. Please check your payment details and try again.
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button onClick={handlePayment} disabled={isProcessing} className="w-full">
                {isProcessing ? "Processing..." : "Pay Now"}
              </Button>
            </CardFooter>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Saved Payment Methods</CardTitle>
              <CardDescription>Your previously saved payment methods</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-md">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-16 bg-muted rounded-md flex items-center justify-center">
                      <CreditCard className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-medium">Visa ending in 4242</p>
                      <p className="text-sm text-muted-foreground">Expires 12/2025</p>
                    </div>
                  </div>
                  <Badge>Default</Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-md">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-16 bg-muted rounded-md flex items-center justify-center">
                      <Wallet className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-medium">BaridiMob</p>
                      <p className="text-sm text-muted-foreground">+213 555 *** ***</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    Use
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Appointment with Dr. Bilal Dahmani</span>
                  <span>3,500 DZD</span>
                </div>
                <div className="flex justify-between">
                  <span>Consultation Fee</span>
                  <span>3,000 DZD</span>
                </div>
                <div className="flex justify-between">
                  <span>Platform Fee</span>
                  <span>500 DZD</span>
                </div>

                <Separator />

                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>3,500 DZD</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t">
                <h4 className="font-medium mb-2">Appointment Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date</span>
                    <span>November 15, 2023</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Time</span>
                    <span>10:00 AM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type</span>
                    <span>In-person Consultation</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Location</span>
                    <span>Algiers Medical Center</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t">
                <h4 className="font-medium mb-2">Cancellation Policy</h4>
                <p className="text-sm text-muted-foreground">
                  Free cancellation up to 24 hours before your appointment. Cancellations within 24 hours may incur a
                  fee of 1,000 DZD.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}


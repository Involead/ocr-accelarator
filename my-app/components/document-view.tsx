"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react"

export function DocumentView({ documentId }: { documentId: string }) {
  const [formData, setFormData] = useState({
    ssn: "000-00-0000",
    ein: "00-0000000",
    employerName: "Company Name",
    employerAddress: "Street Address",
    wages: "Amount",
    federalTax: "Amount",
    ssTax: "Amount",
    medicareTax: "Amount",
    stateId: "State",
    stateWages: "Amount",
    stateTax: "Amount",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="flex h-full">
      <div className="w-1/2 h-full border-r border-gray-200 p-6 overflow-auto">
        <div className="mb-4">
          <h2 className="text-lg font-medium">W2.pdf</h2>
          <div className="text-sm text-gray-500">Format</div>
          <div className="text-sm text-gray-500">Upload date</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-md p-4 h-[calc(100%-100px)] flex items-center justify-center">
          <img
            src="/placeholder.svg?height=600&width=400"
            alt="W2 Document Preview"
            className="max-w-full max-h-full object-contain"
          />
        </div>
      </div>
      <div className="w-1/2 h-full p-6 overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-medium">W2.pdf Extract</h2>
          <Button variant="ghost" size="sm">
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-gray-600">Employee's Social Security Number</label>
              <Input name="ssn" value={formData.ssn} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-600">Employer Identification Number (EIN)</label>
              <Input name="ein" value={formData.ein} onChange={handleChange} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-gray-600">Employer's Name</label>
              <Input name="employerName" value={formData.employerName} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-600">Employer's Address</label>
              <Input name="employerAddress" value={formData.employerAddress} onChange={handleChange} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-gray-600">Wages, tips, other compensation</label>
              <Input name="wages" value={formData.wages} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-600">Federal income tax withheld</label>
              <Input name="federalTax" value={formData.federalTax} onChange={handleChange} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-gray-600">Social Security wages</label>
              <Input name="ssTax" value={formData.ssTax} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-600">Social Security tax withheld</label>
              <Input name="medicareTax" value={formData.medicareTax} onChange={handleChange} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-gray-600">Medicare wages and tips</label>
              <Input name="wages" value={formData.wages} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-600">Medicare tax withheld</label>
              <Input name="medicareTax" value={formData.medicareTax} onChange={handleChange} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-gray-600">State</label>
              <Input name="stateId" value={formData.stateId} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-600">State Employer's ID Number</label>
              <Input name="stateId" value={formData.stateId} onChange={handleChange} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-gray-600">State wages, tips, etc.</label>
              <Input name="stateWages" value={formData.stateWages} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-600">State income tax</label>
              <Input name="stateTax" value={formData.stateTax} onChange={handleChange} />
            </div>
          </div>

          <div className="pt-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Checkbox id="review" />
              <label htmlFor="review" className="text-sm text-gray-600">
                Review document
              </label>
            </div>
            <Button className="bg-gray-500 hover:bg-gray-600 text-white">Save</Button>
          </div>

          <div className="pt-4">
            <textarea
              placeholder="Add a comment"
              className="w-full p-3 border border-gray-300 rounded-md h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
    </div>
  )
}


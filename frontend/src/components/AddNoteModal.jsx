import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createCareNoteAsync } from "../store/careNotesSlice";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

const AddNoteModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    residentName: "",
    content: "",
    authorName: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await dispatch(createCareNoteAsync(formData)).unwrap();
      
      // Reset form
      setFormData({
        residentName: "",
        content: "",
        authorName: "",
      });
      
      onClose();
    } catch (error) {
      console.error('Failed to create note:', error);
      // You could add error handling here (show toast, etc.)
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Note</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="residentName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Resident Name
            </label>
            <Input
              id="residentName"
              name="residentName"
              value={formData.residentName}
              onChange={handleChange}
              placeholder="Enter resident name"
              required
            />
          </div>
          
          <div>
            <label
              htmlFor="authorName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Author Name
            </label>
            <Input
              id="authorName"
              name="authorName"
              value={formData.authorName}
              onChange={handleChange}
              placeholder="Enter author name"
              required
            />
          </div>

          <div>
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Note Content
            </label>
            <Textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Enter note content"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="4"
              required
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Add Note</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddNoteModal;

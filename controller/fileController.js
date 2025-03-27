const tokenGenerator = require("../auth/auth").tokenGenerator;
const express = require('express');
const path = require("path");

const User = require("../models/userModel");
const FileModel = require("../models/fileModel");

async function createFolder(req, res) {
  const { fileName, parentId, isFile } = req.body;
  if (![fileName, parentId, isFile].every((field) => field !== undefined)) {
    return res.status(400).json({ error: "All fields are required" });
  }
  try {
    let ext, baseName, newFileName
    const count = await FileModel.countDocuments({ userId: req.user.id, status: "ACTIVE" });
    const fileNameCount = await FileModel.countDocuments({ userId: req.user.id, parentId: parentId, fileName: fileName, status: "ACTIVE" });

    if (isFile) {
      ext = path.extname(fileName)
      baseName = path.basename(fileName, ext);
      newFileName = `${baseName}(${fileNameCount})${ext}`
    } else {
      if (fileNameCount) {
        return res.status(400).json({ message: "Cannot create a new Folder with same name" });
      }
    }

    const newFolder = new FileModel({
      fileName: fileNameCount ? newFileName : fileName,
      number: count + 1,
      parentId: parentId,
      isFile: isFile === "true",
      userId: req.user.id,
      location: fileNameCount ? newFileName : fileName,
      isFavorite: false,
      fileExtension: isFile ? fileName.split(".").pop() : null,
      status: "ACTIVE",
    });

    await newFolder.save();
    return res.status(201).json({ message: "Folder/File created successfully", data: newFolder });
  } catch (error) {
    console.error("Error creating folder/file:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function getFolders(req, res) {
  try {
    const files = await FileModel.find({ userId: req.user.id, status: "ACTIVE" }).sort({ fileName: 1 });
    const buildTree = (parentId) => {
      return files
        .filter((file) => (file.parentId ? file.parentId.toString() : null) === (parentId ? parentId.toString() : null)) // Ensure null handling
        .map((file) => ({
          ...file._doc,
          children: buildTree(file._id.toString()),
        }));
    };
    const tree = buildTree(null);
    return res.status(200).json({ message: "Documents Fetched Successfully", data: tree });
  } catch (error) {
    console.error("Error fetching folders/files:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function updateFolder(req, res) {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const updatedFolder = await FileModel.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedFolder) {
      return res.status(404).json({ message: "Folder/File not found" });
    }
    return res.status(200).json({ message: "Folder/File updated successfully", data: updatedFolder });
  } catch (error) {
    console.error("Error updating folder/file:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function deleteFolder(req, res) {
  const { id } = req.params;

  try {
    const data = await FileModel.findOne({ _id: id });
    if (!data) {
      return res.status(404).json({ message: "Folder/File not found" });
    }
    if (data.parentId == null) {
      return res.status(400).json({ message: "Cannot delete root folder" });
    }
    await FileModel.findByIdAndUpdate(id, { status: "DELETED" }, { new: true });
    return res.status(200).json({ message: "Folder/File deleted successfully" });
  } catch (error) {
    console.error("Error deleting folder/file:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function dashboard(req, res) {
  try {
    const [AllUploads, totalFolder, totalFiles, totalFavourite] = await Promise.all([
      FileModel.countDocuments({ userId: req.user.id, status: "ACTIVE" }),
      FileModel.countDocuments({ userId: req.user.id, isFile: false, status: "ACTIVE" }),
      FileModel.countDocuments({ userId: req.user.id, isFile: true, status: "ACTIVE" }),
      FileModel.countDocuments({ userId: req.user.id, isFavorite: true, status: "ACTIVE" }),
    ]);

    const data = { AllUploads, totalFolder, totalFiles, totalFavourite };
    return res.status(200).json({ message: "Data fetched successfully", data: data });
  } catch (error) {
    console.error("Error fetching dashboard", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function getFavorites(req, res) {
  try {
    const data = await FileModel.find({ userId: req.user.id, isFavorite: true, isFile: true, status: "ACTIVE" })
    return res.status(200).json({ message: "Data fetched successfully", data: data });
  } catch (error) {
    console.error("Error fetching favorurites", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function markFavorites(req, res) {
  try {
    const data = await FileModel.findOne({ _id: req.params._id });
    if (!data) {
      return res.status(404).json({ message: "Data not found." });
    }
    const updatedData = await FileModel.findOneAndUpdate(
      { _id: req.params._id },
      { $set: { isFavorite: !data.isFavorite } },
      { new: true }
    );
    return res.status(200).json({ message: "Updated Favorite successfully", data: updatedData });
  } catch (error) {
    console.error("Error updating favorite status", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = { createFolder, getFolders, updateFolder, deleteFolder, dashboard, getFavorites, markFavorites };
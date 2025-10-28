package com.prashant.quicktext.server.service;

import org.springframework.web.multipart.MultipartFile;

/**
 * Service interface for handling image uploads to Cloudinary.
 */
public interface CloudinaryService {

    /**
     * Uploads an image file to Cloudinary.
     *
     * @param file the image file to upload (as {@link MultipartFile})
     * @return the secure URL of the uploaded image
     */
    String uploadImage(MultipartFile file);
}

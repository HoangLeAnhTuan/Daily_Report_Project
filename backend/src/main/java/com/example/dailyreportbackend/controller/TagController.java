package com.example.dailyreportbackend.controller;

import com.example.dailyreportbackend.model.Tag;
import com.example.dailyreportbackend.service.TagService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tags")
@CrossOrigin(origins = "${cors.allowed.origins}")
public class TagController {

    @Autowired
    private TagService tagService;

    @GetMapping
    public ResponseEntity<List<Tag>> getAllTags() {
        try {
            System.out.println("Getting all tags");
            List<Tag> tags = tagService.getAllTags();
            return ResponseEntity.ok(tags);
        } catch (Exception e) {
            System.out.println("Error getting tags: " + e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Tag> getTagById(@PathVariable Long id) {
        try {
            System.out.println("Getting tag with id: " + id);
            Tag tag = tagService.getTagById(id);
            return ResponseEntity.ok(tag);
        } catch (Exception e) {
            System.out.println("Error getting tag: " + e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping
    public ResponseEntity<Tag> createTag(@RequestBody Tag tag) {
        try {
            System.out.println("Creating tag: " + tag.getName());
            Tag savedTag = tagService.createTag(tag);
            return ResponseEntity.ok(savedTag);
        } catch (Exception e) {
            System.out.println("Error creating tag: " + e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
} 
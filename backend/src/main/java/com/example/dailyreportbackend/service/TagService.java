package com.example.dailyreportbackend.service;

import com.example.dailyreportbackend.model.Tag;

import java.util.List;

public interface TagService {
    List<Tag> getAllTags();
    Tag getTagById(Long id);
    Tag createTag(Tag tag);
} 
package com.example.dailyreportbackend.service.impl;

import com.example.dailyreportbackend.exception.ResourceNotFoundException;
import com.example.dailyreportbackend.model.Tag;
import com.example.dailyreportbackend.repository.TagRepository;
import com.example.dailyreportbackend.service.TagService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TagServiceImpl implements TagService {

    @Autowired
    private TagRepository tagRepository;

    @Override
    public List<Tag> getAllTags() {
        return tagRepository.findAll();
    }

    @Override
    public Tag getTagById(Long id) {
        return tagRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tag", "id", id));
    }

    @Override
    public Tag createTag(Tag tag) {
        return tagRepository.save(tag);
    }
} 
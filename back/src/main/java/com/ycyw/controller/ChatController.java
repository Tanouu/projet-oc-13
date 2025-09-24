package com.ycyw.controller;

import com.ycyw.dto.ChatMessage;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {

    @MessageMapping("/chat/{conversationId}")
    @SendTo("/topic/chat/{conversationId}")
    public ChatMessage broadcast(@DestinationVariable String conversationId, ChatMessage message) {
        System.out.printf("[%s] (%s) %s%n", conversationId, message.getFromRole(), message.getContent());
        return message;
    }
}

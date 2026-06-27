# QAI: project vision

## Problem

QAI addresses a deficit in the capabilities of large language models (LLMs). They have the potential to answer questions about any technical topic, but they give inferior answers unless they have access to the most powerful specialized tools. Your problem, as a user of LLMs, is to provide that access, so you get superior answers.

## Intended users

LLMs are democratizing access to knowledge by using natural language to communicate with users. If you can read and write and you want technical knowledge from an LLM, you are an intended user of QAI.

One point needs clarification: the topic. QAI will show you how to equip LLMs with tools for one technical topic: the evaluation of the front-end quality (accessibility, usability, and standards conformity) of web pages. For any other topic, the methods are similar, so QAI can be informative regardless of the topic that you want LLM assistance for.

## Goals

After you complete QAI, you should be able to give any widely used LLM on any widely used AI platform access to advanced tools for the example topic covered by QAI (front-end quality on the web). To extend this to other topics, you can find relevant tools and use the same methods for them.

## Motivation

The author of QAI is the maintainer of Kilotest, Testaro, and Testilo: three open-source projects that combine to provide a uniquely comprehensive platform for front-end quality testing on the web. Kilotest provides the web interface of the platform, designed for direct use by human beings. Kilotest also has the infrastructure needed for LLMs to use it. Whenever you ask LLMs to handle the testing, reporting, and interpretation for you, the LLMs need **you** to set up a connection from them to Kilotest. The purpose of QAI is to fill that gap: to show you how to do your part.

## Initial scope

The initial scope of QAI is limited in two ways:

- Target platforms: QAI initially will show you how to connect only particular AI platforms to Kilotest by means of one method.
- Tutorial format: QAI initially will be a static document, with only text and images, but no video and no interaction with you.

A limited initial scope will permit rapid prototyping, so you can try QAI out and provide comments and suggestions for improvement.

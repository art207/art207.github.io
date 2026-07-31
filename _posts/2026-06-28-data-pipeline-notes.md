---
layout: post
title: "Notes on building a data pipeline that doesn't page me at 3am"
date: 2026-06-28
kind: post
tags: ["Data Engineering", "Pipelines"]
readtime: "6 min read"
excerpt: "What broke first, what we over-engineered for no reason, and the one alert that mattered more than the rest combined."
---
This is placeholder body copy for an example post — replace it with your own writing. Keep the structure (one title in the front matter, then plain paragraphs) so new posts stay visually consistent.

A few things worth calling out when you're editing this template: subheadings use `## text`, code blocks use fenced triple-backticks, and pull-quotes use `> text`.

## What actually broke

Swap this section for your real content. A short paragraph, then maybe a code sample:

```
dag.task("daily_sales_model", retries=3, sla_minutes=45, alert_on_schema_drift=True)
```

> A dashboard is only as trustworthy as the pipeline feeding it — pull-quotes render with a tinted background and a left rule, good for a callout or a key takeaway.

## What we'd do differently

More placeholder text. Delete this whole article and write your own once the template feels right.

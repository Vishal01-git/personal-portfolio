"use client";

import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const posts = [
  {
    id: 1,
    title: "DBT Best Practices for Enterprise Data Models",
    excerpt: "Learn how to structure your DBT projects, manage macros, and enforce data quality testing across Medallion architectures.",
    date: "Oct 12, 2026",
    readTime: "8 min read",
    tags: ["DBT", "Architecture", "Data Modeling"]
  },
  {
    id: 2,
    title: "Snowflake Optimization Strategies",
    excerpt: "Deep dive into clustering keys, auto-suspend configurations, and result caching to reduce Snowflake compute costs by over 40%.",
    date: "Sep 28, 2026",
    readTime: "12 min read",
    tags: ["Snowflake", "Cost Optimization", "Performance"]
  },
  {
    id: 3,
    title: "Designing Idempotent Pipelines",
    excerpt: "Why idempotency matters in distributed data systems, and how to implement safe retries using Airflow and Spark.",
    date: "Sep 15, 2026",
    readTime: "10 min read",
    tags: ["Data Pipelines", "Airflow", "System Design"]
  },
  {
    id: 4,
    title: "Decoupling Storage and Compute in Modern Data Lakes",
    excerpt: "An architectural overview of modern open table formats like Delta Lake and Iceberg, and why they replaced traditional Hive structures.",
    date: "Aug 05, 2026",
    readTime: "15 min read",
    tags: ["Data Lake", "Delta", "Iceberg"]
  }
];

export default function BlogPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 pt-10 pb-20 min-h-[80vh]">
      <div className="text-center mb-16 space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold font-heading">
          Technical <span className="text-transparent bg-clip-text bg-gradient-to-r from-primaryGlow to-secondaryGlow">Runbooks</span>
        </h1>
        <p className="text-textSecondary max-w-2xl mx-auto">
          Insights, best practices, and architectural deep-dives from my experience building scalable data platforms.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {posts.map(post => (
          <Link href={`#`} key={post.id}>
            <GlassCard className="group hover:border-primaryGlow/50 transition-all duration-300">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-4 text-xs font-mono text-textSecondary uppercase tracking-wider">
                    <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{post.date}</span>
                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{post.readTime}</span>
                  </div>
                  
                  <h2 className="text-2xl font-bold font-heading group-hover:text-primaryGlow transition-colors duration-300">
                    {post.title}
                  </h2>
                  
                  <p className="text-textSecondary leading-relaxed">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 pt-2">
                    {post.tags.map(tag => (
                      <Badge key={tag} variant="outline" className="bg-surface/50 border-white/5">{tag}</Badge>
                    ))}
                  </div>
                </div>

                <div className="md:w-16 flex items-center justify-end h-full">
                  <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-primaryGlow/20 group-hover:border-primaryGlow/50 group-hover:text-primaryGlow transition-all duration-300">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </GlassCard>
          </Link>
        ))}
      </div>
    </div>
  );
}

'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createUser(formData: FormData) {
  const email = formData.get('email') as string
  const name = formData.get('name') as string

  if (!email) {
    return { success: false, error: 'Email is required' }
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return { success: false, error: 'Email already exists' }
    }

    const user = await prisma.user.create({
      data: {
        email,
        name: name || null,
      },
    })
    
    revalidatePath('/users')
    revalidatePath('/')
    return { success: true, user, message: 'User created successfully!' }
  } catch (error) {
    console.error('Error creating user:', error)
    return { success: false, error: 'Failed to create user' }
  }
}

export async function getUsers() {
  try {
    const users = await prisma.user.findMany({
      include: {
        posts: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    return users
  } catch (error) {
    console.error('Error fetching users:', error)
    return []
  }
}

export async function createPost(formData: FormData) {
  const title = formData.get('title') as string
  const content = formData.get('content') as string
  const authorId = formData.get('authorId') as string

  if (!title || !authorId) {
    return { success: false, error: 'Title and author are required' }
  }

  try {
    const author = await prisma.user.findUnique({
      where: { id: authorId }
    })

    if (!author) {
      return { success: false, error: 'Author not found' }
    }

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const post = await prisma.post.create({
      data: {
        title,
        slug,
        content: content || null,
        authorId,
      },
    })
    
    revalidatePath('/posts')
    revalidatePath('/')
    return { success: true, post, message: 'Post created successfully!' }
  } catch (error) {
    console.error('Error creating post:', error)
    return { success: false, error: 'Failed to create post' }
  }
}

export async function getPosts() {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    return posts
  } catch (error) {
    console.error('Error fetching posts:', error)
    return []
  }
}

export async function togglePostPublished(formData: FormData) {
  const postId = formData.get('postId') as string

  if (!postId) {
    return { success: false, error: 'Post ID is required' }
  }

  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
    })

    if (!post) {
      return { success: false, error: 'Post not found' }
    }

    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        published: !post.published,
      },
    })

    revalidatePath('/posts')
    revalidatePath('/')
    return { 
      success: true, 
      post: updatedPost, 
      message: `Post ${updatedPost.published ? 'published' : 'unpublished'} successfully!`
    }
  } catch (error) {
    console.error('Error toggling post published status:', error)
    return { success: false, error: 'Failed to update post' }
  }
}
import { render } from '@testing-library/react'
import { screen } from '@testing-library/dom'
import TaskList from './TaskList'
import type { Task } from '@repo/types'

describe('TaskList', () => {
  test('renders empty list when no tasks provided', () => {
    render(<TaskList tasks={[]} />)
    
    // Should render the container but no task items
    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
  })

  test('renders single task correctly', () => {
    const task: Task = {
      id: '1',
      title: 'Test Task',
      description: 'Test Description',
      completed: false,
      createdAt: new Date('2024-01-15T10:00:00Z'),
      updatedAt: new Date('2024-01-15T10:00:00Z')
    }

    render(<TaskList tasks={[task]} />)
    
    expect(screen.getByText('Test Task')).toBeInTheDocument()
    expect(screen.getByText('Test Description')).toBeInTheDocument()
    expect(screen.getByText('Pending')).toBeInTheDocument()
    expect(screen.getByText(/Created: 1\/15\/2024/)).toBeInTheDocument()
  })

  test('renders multiple tasks correctly', () => {
    const tasks: Task[] = [
      {
        id: '1',
        title: 'First Task',
        description: 'First Description',
        completed: false,
        createdAt: new Date('2024-01-15T10:00:00Z'),
        updatedAt: new Date('2024-01-15T10:00:00Z')
      },
      {
        id: '2',
        title: 'Second Task',
        completed: true,
        createdAt: new Date('2024-01-16T10:00:00Z'),
        updatedAt: new Date('2024-01-16T10:00:00Z')
      }
    ]

    render(<TaskList tasks={tasks} />)
    
    expect(screen.getByText('First Task')).toBeInTheDocument()
    expect(screen.getByText('First Description')).toBeInTheDocument()
    expect(screen.getByText('Second Task')).toBeInTheDocument()
    expect(screen.getByText('Pending')).toBeInTheDocument()
    expect(screen.getByText('Completed')).toBeInTheDocument()
  })

  test('handles task without description', () => {
    const task: Task = {
      id: '1',
      title: 'Task Without Description',
      completed: false,
      createdAt: new Date('2024-01-15T10:00:00Z'),
      updatedAt: new Date('2024-01-15T10:00:00Z')
    }

    render(<TaskList tasks={[task]} />)
    
    expect(screen.getByText('Task Without Description')).toBeInTheDocument()
    expect(screen.getByText('Pending')).toBeInTheDocument()
    
    // Should not render description paragraph if description is undefined
    const paragraphs = screen.getAllByText(/.*/)
    const descriptionParagraph = paragraphs.find(p => p.textContent === '')
    expect(descriptionParagraph).toBeUndefined()
  })

  test('displays correct status for completed and pending tasks', () => {
    const tasks: Task[] = [
      {
        id: '1',
        title: 'Completed Task',
        completed: true,
        createdAt: new Date('2024-01-15T10:00:00Z'),
        updatedAt: new Date('2024-01-15T10:00:00Z')
      },
      {
        id: '2',
        title: 'Pending Task',
        completed: false,
        createdAt: new Date('2024-01-16T10:00:00Z'),
        updatedAt: new Date('2024-01-16T10:00:00Z')
      }
    ]

    render(<TaskList tasks={tasks} />)
    
    expect(screen.getByText('Completed')).toBeInTheDocument()
    expect(screen.getByText('Pending')).toBeInTheDocument()
  })
})
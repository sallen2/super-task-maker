import { render, waitFor } from '@testing-library/react'
import { screen } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'
import TaskForm from './TaskForm'
import type { Task } from '@repo/types'

// Mock fetch
global.fetch = jest.fn()

// Mock environment variables
process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3002'

const mockOnTaskAdded = jest.fn()

beforeEach(() => {
  jest.clearAllMocks()
  ;(fetch as jest.MockedFunction<typeof fetch>).mockClear()
})

describe('TaskForm', () => {
  test('renders form fields correctly', () => {
    render(<TaskForm onTaskAdded={mockOnTaskAdded} />)
    
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /add task/i })).toBeInTheDocument()
  })

  test('prevents form submission with empty title', async () => {
    const user = userEvent.setup()
    render(<TaskForm onTaskAdded={mockOnTaskAdded} />)
    
    const submitButton = screen.getByRole('button', { name: /add task/i })
    await user.click(submitButton)
    
    expect(fetch).not.toHaveBeenCalled()
    expect(mockOnTaskAdded).not.toHaveBeenCalled()
  })

  test('submits form with title only', async () => {
    const user = userEvent.setup()
    const mockTask: Task = {
      id: '1',
      title: 'Test Task',
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    ;(fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
      ok: true,
      json: async () => mockTask,
    } as Response)

    render(<TaskForm onTaskAdded={mockOnTaskAdded} />)
    
    const titleInput = screen.getByLabelText(/title/i)
    const submitButton = screen.getByRole('button', { name: /add task/i })

    await user.type(titleInput, 'Test Task')
    await user.click(submitButton)

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('http://localhost:3002/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: 'Test Task',
          description: undefined,
        }),
      })
    })

    expect(mockOnTaskAdded).toHaveBeenCalledWith(mockTask)
  })

  test('submits form with title and description', async () => {
    const user = userEvent.setup()
    const mockTask: Task = {
      id: '1',
      title: 'Test Task',
      description: 'Test Description',
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    ;(fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
      ok: true,
      json: async () => mockTask,
    } as Response)

    render(<TaskForm onTaskAdded={mockOnTaskAdded} />)
    
    const titleInput = screen.getByLabelText(/title/i)
    const descriptionInput = screen.getByLabelText(/description/i)
    const submitButton = screen.getByRole('button', { name: /add task/i })

    await user.type(titleInput, 'Test Task')
    await user.type(descriptionInput, 'Test Description')
    await user.click(submitButton)

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('http://localhost:3002/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: 'Test Task',
          description: 'Test Description',
        }),
      })
    })

    expect(mockOnTaskAdded).toHaveBeenCalledWith(mockTask)
  })

  test('clears form fields after successful submission', async () => {
    const user = userEvent.setup()
    const mockTask: Task = {
      id: '1',
      title: 'Test Task',
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    ;(fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
      ok: true,
      json: async () => mockTask,
    } as Response)

    render(<TaskForm onTaskAdded={mockOnTaskAdded} />)
    
    const titleInput = screen.getByLabelText(/title/i) as HTMLInputElement
    const descriptionInput = screen.getByLabelText(/description/i) as HTMLTextAreaElement
    const submitButton = screen.getByRole('button', { name: /add task/i })

    await user.type(titleInput, 'Test Task')
    await user.type(descriptionInput, 'Test Description')
    await user.click(submitButton)

    await waitFor(() => {
      expect(titleInput.value).toBe('')
      expect(descriptionInput.value).toBe('')
    })
  })
})
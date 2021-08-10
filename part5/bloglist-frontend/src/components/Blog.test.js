import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'

test('renders content', () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'tester',
    url: 'test.com',
    user: {
      name: 'super root'
    }
  }

  const component = render(
    <Blog blog={blog} />
  )

  expect(component.container).toHaveTextContent('Component testing is done with react-testing-library')
  expect(component.container).toHaveTextContent('tester')

  //const element = component.getByText('Component testing is done with react-testing-library')
  //expect(element).toBeDefined()

  //const div = component.container.querySelector('.blog')
  //console.log(prettyDOM(div))
  //expect(div).toHaveTextContent('<div>Component testing is done with react-testing-library')
})

test('clicking the view button shows url and likes', () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'tester',
    url: 'test.com',
    likes: 50,
    user: {
      name: 'super root'
    }
  }

  const component = render(
    <Blog blog={blog} />
  )

  //const button = component.getByText('view')
  //fireEvent.click(button)

  expect(component.container).toHaveTextContent('test.com')
  expect(component.container).toHaveTextContent('50')
})

test('clicking the like button calls event handler once', () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'tester',
    url: 'test.com',
    user: {
      name: 'super root'
    }
  }

  const mockHandler = jest.fn()

  const component = render(
    <Blog blog={blog} handleUpdateBlog={mockHandler} />
  )

  const button = component.getByText('like')
  fireEvent.click(button)

  expect(mockHandler.mock.calls).toHaveLength(1)
})

test('clicking the like button twice calls event handler twice', () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'tester',
    url: 'test.com',
    user: {
      name: 'super root'
    }
  }

  const mockHandler = jest.fn()

  const component = render(
    <Blog blog={blog} handleUpdateBlog={mockHandler} />
  )

  const button = component.getByText('like')
  fireEvent.click(button)
  fireEvent.click(button)

  expect(mockHandler.mock.calls).toHaveLength(2)
})
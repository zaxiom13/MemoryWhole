import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ResetConfirmationModal from './ResetConfirmationModal';

describe('ResetConfirmationModal', () => {
  test('calls the provided callbacks', async () => {
    const onConfirm = jest.fn();
    const onCancel = jest.fn();

    render(<ResetConfirmationModal onConfirm={onConfirm} onCancel={onCancel} />);

    expect(screen.getByText(/confirm reset/i)).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /confirm/i }));
    expect(onConfirm).toHaveBeenCalledTimes(1);

    await userEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});

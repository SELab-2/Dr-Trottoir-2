import Navbar from "@/components/Navbar"
import {render, screen, fireEvent} from "@testing-library/react";
import '@testing-library/jest-dom'

test('User info visible', async () => {
    render(<Navbar user={{"last_name": "Lachaert", "first_name": "Michiel"}} />)

    screen.getByText(/Michiel/i, {});
    screen.getByText(/Lachaert/i, {});
});

test('Direction press Dashboard', async () => {
    render(<Navbar user={{"last_name": "Lachaert", "first_name": "Michiel"}} />)

    const link = screen.getByRole('link', {name:"Dashboard"});
    expect(link).toBeInTheDocument()

    fireEvent.click(link);
    expect(link).toHaveAttribute('href', '#');})
import Navbar from "@/components/Navbar"
import {render, screen, fireEvent} from "@testing-library/react";
import '@testing-library/jest-dom'

test('User info not visible when no data is given', async() => {

});

test('User info visible', async () => {
    render(<Navbar user={{"last_name": "Lachaert", "first_name": "Michiel"}} />)

    screen.getByText(/Michiel/i, {});
    screen.getByText(/Lachaert/i, {});
});

test('Direction press Dashboard', async () => {
    render(<Navbar user={{"last_name": "Lachaert", "first_name": "Michiel"}} />)

    const link = screen.getByRole('link', {name:"Dashboard"});
    expect(link).toBeInTheDocument()

    expect(link).toHaveAttribute('href', '/admin/dashboard');})
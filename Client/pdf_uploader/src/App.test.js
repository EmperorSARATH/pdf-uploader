import { fireEvent, render, screen,waitFor } from '@testing-library/react';
import App from './App';
import "@testing-library/jest-dom/extend-expect";

test('Test to check if button names are correct', () => {
  const {getByText } = render(<App />);
   getByText('Submit PDF',{ exact:true});
   getByText('Extract PDF',{ exact:true});
});

test('Test to check if Header is correct', () => {
  const {getByText } = render(<App />);
  getByText('PDF UPLOADER',{ exact:true});
});

test("To check if hovering over excalamation mark get's the tooltip",async()=>{
  const{queryByTestId} =  render(<App/>);
 
  const info = queryByTestId("info");

  fireEvent.mouseEnter(info);
  
  await screen.findByRole(/tooltip/);
  expect(screen.getByRole(/tooltip/)).toBeInTheDocument();

});

test('should accept user input', async () => {

  const { getByTestId } = render(<App/>);
  

  await waitFor(() => getByTestId('page-input'));

 
  const inputField = getByTestId('page-input');
  

  inputField.value = '1-2,5';


  inputField.dispatchEvent(new Event('input', { bubbles: true }));


  expect(inputField.value).toBe('1-2,5');
});



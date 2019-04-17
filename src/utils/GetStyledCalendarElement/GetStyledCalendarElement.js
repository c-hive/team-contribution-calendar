import $ from 'elly';
import * as ColorSchemas from '../../resources/ColorSchemas/ColorSchemas';
import LoaderIcon from '../../resources/assets/SVG/LoaderIcon/LoaderIcon.svg';

export const container = (htmlContainerElement) => {
  const selectedDOMElement = $(htmlContainerElement);

  selectedDOMElement.style.width = '700px';
  selectedDOMElement.style.borderTopLeftRadius = '3px';
  selectedDOMElement.style.borderTopRightRadius = '3px';
  selectedDOMElement.style.border = '1px solid #E1E4E8';
  selectedDOMElement.style.padding = '10px 0 10px 20px';
  selectedDOMElement.style.margin = '20px auto';
  selectedDOMElement.style.fontSize = '10px';

  return selectedDOMElement;
};

const getColorElement = (color) => {
  const colorELement = document.createElement('LI');

  colorELement.style.width = '10px';
  colorELement.style.height = '10px';
  colorELement.style.display = 'inline-block';
  colorELement.style.margin = '0 2px';
  colorELement.style.backgroundColor = color;

  return colorELement;
};

const getColorsList = () => {
  const calendarColorsList = document.createElement('UL');

  calendarColorsList.style.listStyle = 'none';

  ColorSchemas.GitHub.forEach((color) => {
    const colorElement = getColorElement(color);

    calendarColorsList.appendChild(colorElement);
  });

  const lessText = document.createElement('SPAN');
  lessText.innerText = 'Less';
  lessText.style.margin = '0 5px';

  const moreText = document.createElement('SPAN');
  moreText.innerText = 'More';
  moreText.style.margin = '0 5px';

  calendarColorsList.insertBefore(lessText, calendarColorsList.childNodes[0]);
  calendarColorsList.insertBefore(moreText, calendarColorsList.nextSibling);

  return calendarColorsList;
};

export const header = (totalContributions, isLoading) => {
  const calendarHeader = document.createElement('DIV');
  const calendarColorsList = getColorsList();

  calendarHeader.style.fontSize = '12px';

  const contributionsValueDisplayer = document.createElement('P');
  contributionsValueDisplayer.innerHTML = LoaderIcon;

  if (!isLoading) {
    contributionsValueDisplayer.innerText = `${totalContributions} contributions in the last year`;
  }

  calendarHeader.appendChild(contributionsValueDisplayer);
  calendarHeader.appendChild(calendarColorsList);

  calendarHeader.style.display = 'flex';
  calendarHeader.style.justifyContent = 'space-between';
  calendarHeader.style.alignItems = 'center';
  calendarHeader.style.width = '670px';

  return calendarHeader;
};

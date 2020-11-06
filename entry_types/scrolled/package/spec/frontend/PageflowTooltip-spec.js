import React from "react"
import {render as testingLibraryRenderer, fireEvent} from '@testing-library/react'

import {PageflowTooltip} from "frontend/PageflowTooltip";

describe("PageflowTooltip", () => {
  
  const render = props =>
    testingLibraryRenderer(
      <PageflowTooltip fixed={props.fixed} content={props.content} closeOther={props.closeOther} classWhenOpen={props.classWhenOpen}>
        <button data-testid={props.triggerId || 'tooltip_trigger'} >Tooltip trigger</button>
      </PageflowTooltip>
    )

  const renderWithoutChildren = props =>
    testingLibraryRenderer(<PageflowTooltip fixed={props.fixed} content={props.content} closeOther={props.closeOther}/>)

  it("should render the content", () => {
    const wrapper = render({
      content: <p data-testid='tooltip_content'>tooltip content</p>,
      fixed: true
    })
    expect(wrapper.getByTestId('tooltip_content')).toBeDefined();
  });

  it("should not render the content when fixed is false", () => {
    const wrapper = render({
      content: <p data-testid='tooltip_content'>tooltip content</p>,
      fixed: false
    })
    expect(wrapper.queryByTestId('tooltip_content')).toBeNull();
  });

  it("should render the content when trigger is clicked", () => {
    const wrapper = render({
      content: <p data-testid='tooltip_content'>tooltip content</p>,
      fixed: false
    })
    expect(wrapper.queryByTestId('tooltip_content')).toBeNull();
    
    fireEvent.click(wrapper.queryByTestId('tooltip_trigger'));

    expect(wrapper.queryByTestId('tooltip_content')).toBeDefined();
  });

  it("should render the content without children", () => {
    const wrapper = renderWithoutChildren({
      content: <p data-testid='tooltip_content'>tooltip content</p>,
      fixed: true
    })
    expect(wrapper.getByTestId('tooltip_content')).toBeDefined();
  });

  it("should apply the given class to content when expanded", () => {
    const wrapper = render({
      content: <p data-testid='tooltip_content'>tooltip content</p>,
      fixed: false,
      classWhenOpen: 'classWhenOpen'
    })    
    let trigger = wrapper.queryByTestId('tooltip_trigger')
    fireEvent.click(trigger);
    expect(trigger.className).toBe('classWhenOpen')
    
  });

  it("should close other tooltips when clicked", () => {
    const wrapper1 = render({
      content: <p data-testid='tooltip_content1'>tooltip content</p>,
      fixed: false,
      triggerId: 'tooltip_trigger1',
      closeOther: true
    });
    const wrapper2 = render({
      content: <p data-testid='tooltip_content2'>tooltip content</p>,
      fixed: false,
      triggerId: 'tooltip_trigger2',
      closeOther: true
    });
    
    fireEvent.click(wrapper1.queryByTestId('tooltip_trigger1'));
    expect(wrapper1.queryByTestId('tooltip_content1')).toBeDefined();
    expect(wrapper2.queryByTestId('tooltip_content2')).toBeNull();
    
    fireEvent.click(wrapper2.queryByTestId('tooltip_trigger2'));
    expect(wrapper2.queryByTestId('tooltip_content2')).toBeDefined();
    expect(wrapper1.queryByTestId('tooltip_content1')).toBeNull();
  });
  


})

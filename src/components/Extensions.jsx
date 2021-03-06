import React, { Component } from "react";
import { FormGroup, FormControl } from 'react-bootstrap';
import Util from './Util';
import { Item, Endpoint } from './Survey'

// Renders a single option either radio or checkbox
class OptionItem extends Component {
    static initialState() {
        return {
            id: Util.generateId('o'),
            order: 1,
            content: '',
            endpoints: [Endpoint.initialState('right', null, null)]
        }
    }

    render() {
        return (
            <Item
                key={this.props.id}
                draggable={false}
                {...this.props}
            >
                <div className='option-item ml-16 mr-16 mb-4' id={this.key}>
                    <div className={'symbol mr-8 ' + this.props.type} />
                    <div className='content'>
                        <FormGroup
                            key={this.props.id}
                            controlId={this.props.id}
                            className='text mr-4 mb-0 '
                        >
                            <FormControl
                                key={this.props.id}
                                type="text"
                                value={this.props.content}
                                placeholder={"Option " + this.props.order}
                                onChange={(e) => this.props.optionChangeText(this.props.questionId, e)}
                            />
                        </FormGroup>
                        <div onClick={() => this.props.removeOption(this.props.questionId, this.props.id)} className='delete'>&#10006;</div>
                    </div>
                </div>
            </Item>
        );
    }
}

export default OptionItem;

import React, { Component } from "react";
import { Question } from './Survey';
import OptionItem from './Extensions';

export class TextboxQuestion extends Component {
    render() {
        return <Question key={this.props.id} {...this.props} name={'Textbox Question'} />
    }
}

export class MultipleChoiceQuestion extends Component {
    render() {
        return (
            <Question key={this.props.id} {...this.props} name={'Multiple Choice Question'}>
                {this.props.options.map((op) => {
                    op.optionChange = this.props.optionChange;
                    op.optionRemove = this.props.optionRemove;
                    op.questionId = this.props.id;
                    op.type = this.props.type;
                    return <OptionItem key={op.id} {...op} />
                })}
            </Question>
        )
    };
}

export class SingleChoiceQuestion extends Component {
    render() {
        return (
            <Question key={this.props.id} {...this.props} name={'Single Choice Question'}>
                {this.props.options.map((op) => {
                    op.optionChange = this.props.optionChange;
                    op.optionRemove = this.props.optionRemove;
                    op.questionId = this.props.id;
                    op.type = this.props.type;
                    return <OptionItem key={op.id} {...op} />
                })}
            </Question>
        )
    }
}

export class CommentQuestion extends Component {
    render() {
        return <Question key={this.props.id} {...this.props} name={'Comment Question'} />
    }
}

export const Types = {
    'textbox': TextboxQuestion,
    'check': MultipleChoiceQuestion,
    'radio': SingleChoiceQuestion,
    'comment': CommentQuestion
};

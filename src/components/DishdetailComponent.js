import React, { Component } from "react";
import {Card, CardImg, CardText, CardBody, CardTitle, Breadcrumb, Row, Col, Label, BreadcrumbItem, Button, Modal, ModalHeader, ModalBody } from "reactstrap";
import { Control, LocalForm, Errors } from 'react-redux-form';
import { Link } from "react-router-dom";
 
function RenderDish(dishDetail) {
  return (
    <Card>
      <CardImg top src={dishDetail.image} alt={dishDetail.name} />
      <CardBody>
        <CardTitle>{dishDetail.name}</CardTitle>
        <CardText>{dishDetail.description}</CardText>
      </CardBody>
    </Card>
  );
}

function RenderComments({comments, addComment, dishId}) {
  let commentList = comments.comments.map((comment, i) => (
    <li key={i} className="commentList">
      {comment.comment}
      <br />
      <br />
      -- {comment.author},
      {new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit"
      }).format(new Date(Date.parse(comment.date)))}
      <br />
      <br />
    </li>
  ));
  commentList.push(<CommentForm dishId = {dishId} addComment={addComment} ></CommentForm>);
  return commentList;
}
const DishDetail = props => {
  return (
    <div className="container">
      <div className="row">
        <Breadcrumb>
          <BreadcrumbItem>
            <Link to="/menu">Menu</Link>
          </BreadcrumbItem>
          <BreadcrumbItem active>{props.dish.name}</BreadcrumbItem>
        </Breadcrumb>
        <div className="col-12">
          <h3>{props.dish.name}</h3>
          <hr />
        </div>
      </div>
      <div className="row">
        <div className="col-12 col-md-5 m-1">
          <RenderDish {...props.dish} />
        </div>
        <div className="col-12 col-md-5 m-1">
          <RenderComments comments={props.comments} 
            addComment={props.addComment}
            dishId={props.dish.id}/>
        </div>
      </div>
    </div>
  );
};

export default DishDetail;

const required = (val) => val && val.length;
const maxLength = (len) => (val) => !val || (val.length <= len);
const minLength = (len) => (val) => val && (val.length >= len);

export class CommentForm extends Component{
  constructor(props) {
    super(props);

    this.state = {
        isModalOpen: false
    };
    this.toggleModal = this.toggleModal.bind(this);
    this.handleSubmit=this.handleSubmit.bind(this);
  }

  toggleModal() {
    this.setState({
      isModalOpen: !this.state.isModalOpen
    });
  }
  
  handleSubmit(values) {
    this.toggleModal();
    this.props.addComment(this.props.dishId, values.rating, values.author, values.comment);
}
render(){
  return(
    <div className="container">
      <Button outline  onClick={this.toggleModal}>
        <span className="fa fa-pencil"/>Submit Comment
      </Button>
      <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
        <ModalHeader toggle={this.toggleModal}>Submit Comment</ModalHeader>
            <ModalBody>
                <LocalForm onSubmit={(values) => this.handleSubmit(values)}>
                  <Row className="form-group">
                      <Col md={{size: 12}}>
                          <Control.select model=".rating" name="rating"
                              className="form-control">
                              <option>1</option>
                              <option>2</option>
                              <option>3</option>
                              <option>4</option>
                              <option>5</option>
                          </Control.select>
                      </Col>
                  </Row>
                  <Row className="form-group">
                      <Label htmlFor="author" md={12}>Your Name</Label>
                      <Col md={12}>
                          <Control.text model=".author" id="author" name="author"
                              placeholder="Your Name"
                              className="form-control"
                              validators={{
                                  required, minLength: minLength(3), maxLength: maxLength(15)
                              }}
                              />
                          <Errors
                              className="text-danger"
                              model=".author"
                              show="touched"
                              messages={{
                                  required: 'Required',
                                  minLength: 'Must be greater than 2 characters',
                                  maxLength: 'Must be 15 characters or less'
                              }}
                          />
                      </Col>
                  </Row>
                  <Row className="form-group">
                      <Label htmlFor="comment" md={12}>Your Feedback</Label>
                      <Col md={12}>
                          <Control.textarea model=".comment" id="comment" name="comment"
                              rows="6"
                              className="form-control" />
                      </Col>
                  </Row>
                  <Row className="form-group">
                      <Col md={{size:10}}>
                          <Button type="submit" color="primary">
                          Submit
                          </Button>
                      </Col>
                  </Row>
                </LocalForm>
            </ModalBody>
      </Modal> 
    </div>
  );
 }
}
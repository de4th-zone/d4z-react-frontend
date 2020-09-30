import React, { useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import MainLayout from '../../layouts/MainLayout';
import { editPostThunk, updatePostThunk } from '../../thunks/postThunk';
import { fetchTagThunk } from '../../thunks/tagThunk';
import { fetchCategoryThunk } from '../../thunks/categoryThunk';
import isEmpty from '../../helpers/isEmpty';
import EditPostLoading from '../../components/Loading/EditPostLoading';
import InputFormik from '../../components/Formik/InputFormik';
import TextareaFormik from '../../components/Formik/TextareaFormik';
import RichTextEditorFormik from '../../components/Formik/RichTextEditorFormik';
import SelectInputFormik from '../../components/Formik/SelectInputFormik';

const propTypes = {
	editPostThunk: PropTypes.func.isRequired,
	fetchTagThunk: PropTypes.func.isRequired,
	fetchCategoryThunk: PropTypes.func.isRequired,
	updatePostThunk: PropTypes.func.isRequired,
	editPost: PropTypes.object.isRequired,
	fetchTag: PropTypes.object.isRequired,
	fetchCategory: PropTypes.object.isRequired,
	updatePost: PropTypes.object.isRequired
};
const mapStateToProps = (state) => ({
	editPost: state.editPost,
	fetchTag: state.fetchTag,
	fetchCategory: state.fetchCategory,
	updatePost: state.updatePost
});
const mapDispatchToProps = {
	editPostThunk,
	fetchTagThunk,
	fetchCategoryThunk,
	updatePostThunk
};
const EditPost = (props) => {
	const {
		editPostThunk,
		fetchTagThunk,
		fetchCategoryThunk,
		updatePostThunk,
		editPost,
		fetchTag,
		fetchCategory,
		updatePost
	} = props;
	const { slug } = useParams();
	const history = useHistory();
	useEffect(() => {
		editPostThunk(slug);
		fetchTagThunk();
		fetchCategoryThunk();
	}, []);
	const initialValues = {
		title: editPost.posts.title,
		meta_title: editPost.posts.meta_title,
		meta_description: editPost.posts.meta_description,
		slug: editPost.posts.slug,
		summary: editPost.posts.summary,
		content: editPost.posts.content,
		image: editPost.posts.image,
		tag: [],
		category: []
	};
	const validationSchema = Yup.object({
		title: Yup.string().required('Title is required'),
		meta_title: Yup.string().required('Meta title is required'),
		meta_description: Yup.string().required('Meta description is required'),
		slug: Yup.string().required('Slug is required'),
		summary: Yup.string().required('Summary is required'),
		content: Yup.string().required('Content is required'),
		image: Yup.string().required('Image is required'),
		tag: Yup.array()
			.min(1, 'Pick at least 1 tag')
			.of(
				Yup.object().shape({
					id: Yup.number().required().positive().integer(),
					title: Yup.string().required()
				})
			),
		category: Yup.array()
			.min(1, 'Pick at least 1 category')
			.of(
				Yup.object().shape({
					id: Yup.number().required().positive().integer(),
					title: Yup.string().required()
				})
			)
	});
	const onSubmit = (values) => {
		const { title, meta_title, meta_description, summary, content, image, tag, category } = values;
		const newSlug = values.slug;
		const post = {
			title: title,
			meta_title: meta_title,
			meta_description: meta_description,
			slug: newSlug,
			summary: summary,
			content: content,
			image: image,
			tag: tag,
			category: category
		};
		console.log(post);
		Swal.fire({
			title: 'Do you want to update?',
			icon: 'question',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes',
			cancelButtonText: 'No'
		}).then((result) => {
			if (result.isConfirmed) {
				updatePostThunk(post, history, slug, newSlug);
			}
		});
	};
	return (
		<MainLayout>
			<header className="masthead" style={{ backgroundImage: 'url("/assets/img/home-bg.jpg")' }}>
				<div className="overlay" />
				<div className="container">
					<div className="row">
						<div className="col-lg-8 col-md-10 mx-auto">
							<div className="site-heading">
								<h1>Edit Post</h1>
								<span className="subheading">Admin</span>
							</div>
						</div>
					</div>
				</div>
			</header>
			<div className="container">
				<div className="row">
					<div className="col-lg-8 col-md-10 mx-auto">
						{editPost.loading ? (
							<EditPostLoading />
						) : (
							<div className="nht-form">
								<Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
									{({ values, errors, touched, handleSubmit, setFieldValue, setFieldTouched }) => (
										<form onSubmit={handleSubmit}>
											<div className="control-group">
												<div className="form-group floating-label-form-group controls">
													<TextareaFormik rows="3" label="Title" id="title" name="title" type="text" />
												</div>
											</div>
											<div className="control-group">
												<div className="form-group floating-label-form-group controls">
													<TextareaFormik rows="3" label="Meta title" id="meta_title" name="meta_title" type="text" />
												</div>
											</div>
											<div className="control-group">
												<div className="form-group floating-label-form-group controls">
													<TextareaFormik
														rows="6"
														label="Meta description"
														id="meta_description"
														name="meta_description"
														type="text"
													/>
												</div>
											</div>
											<div className="control-group">
												<div className="form-group floating-label-form-group controls">
													<InputFormik label="Slug" id="slug" name="slug" type="text" />
												</div>
											</div>
											<div className="control-group">
												<div className="form-group floating-label-form-group controls">
													<TextareaFormik rows="6" label="Summary" id="summary" name="summary" type="text" />
												</div>
											</div>
											<div className="control-group">
												<div className="form-group floating-label-form-group controls">
													<RichTextEditorFormik
														label="Content"
														id="content"
														textareaName="content"
														onEditorChange={(selectedValue) => setFieldValue('content', selectedValue)}
														onBlur={() => setFieldTouched('content', true)}
														value={values.content}
														height="333"
														errored={errors.content}
														touched={touched.content}
													/>
												</div>
											</div>
											<div className="control-group">
												<div className="form-group floating-label-form-group controls">
													<SelectInputFormik
														id="tag"
														name="tag"
														label="Tag"
														options={fetchTag.tags}
														onChange={(selectedValue) => {
															if (isEmpty(selectedValue)) {
																selectedValue = [];
															}
															setFieldValue('tag', selectedValue);
														}}
														onBlur={() => setFieldTouched('tag', true)}
														value={values.tag}
														getOptionValue={(option) => option.id}
														getOptionLabel={(option) => option.title}
														errored={errors.tag}
														touched={touched.tag}
													/>
												</div>
											</div>
											<div className="control-group">
												<div className="form-group floating-label-form-group controls">
													<SelectInputFormik
														id="category"
														name="category"
														label="Category"
														options={fetchCategory.categories || []}
														onChange={(selectedValue) => {
															if (isEmpty(selectedValue)) {
																selectedValue = [];
															}
															setFieldValue('category', selectedValue);
														}}
														onBlur={() => setFieldTouched('category', true)}
														value={values.category}
														getOptionValue={(option) => option.id}
														getOptionLabel={(option) => option.title}
														errored={errors.category}
														touched={touched.category}
													/>
												</div>
											</div>
											<div className="control-group">
												<div className="form-group floating-label-form-group controls">
													<InputFormik label="Image" id="image" name="image" type="text" />
												</div>
											</div>
											<div className="text-center">
												{updatePost.loading ? (
													<button type="submit" className="btn btn-primary" disabled>
														<span className="spinner-border spinner-border-sm mr-1" role="status" aria-hidden="true" />
														Loading...
													</button>
												) : (
													<button type="submit" className="btn btn-primary">
														Update
													</button>
												)}
											</div>
										</form>
									)}
								</Formik>
							</div>
						)}
					</div>
				</div>
			</div>
		</MainLayout>
	);
};

EditPost.propTypes = propTypes;

export default connect(mapStateToProps, mapDispatchToProps)(EditPost);

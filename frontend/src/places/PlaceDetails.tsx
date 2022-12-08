import React from "react";
import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router"
import { CurrentUser } from "../contexts/CurrentUser";
import CommentCard from './CommentCard'
import NewCommentForm from "./NewCommentForm";

function PlaceDetails() {

	const {currentUser } = useContext(CurrentUser)

	interface Place {
		pic: string | undefined ;
		name: string | undefined;
		city: string;
		state: string;
		founded: string;
		cuisines: string;
		placeId: string;
		comments: any[]
	}

	const { placeId } :{ placeId:string} = useParams()
	const history = useHistory()
	const [place, setPlace] = useState<any>(null) 


	useEffect(() => {
		const fetchData = async () => {
			const response = await fetch(`http://localhost:5000/places/${placeId}`)
			const resData = await response.json()
			setPlace(resData)
		}
		fetchData()
	}, [placeId])



	if (place === null) {
		return <h1>Loading</h1>
	}



	function editPlace() {
		history.push(`/places/${place.placeId}/edit`)
	}



	async function deletePlace() {
		await fetch(`http://localhost:5000/places/${place.placeId}`, {
			method: 'DELETE'
		})
		history.push('/places')
	}

interface deleteComment{
		commentId: number;

}

interface DeletedComment{
	commentId: number;

}
	async function deleteComment(deletedComment: DeletedComment) {
		await fetch(`http://localhost:5000/places/${place.placeId}/comments/${deletedComment.commentId}`, {
			method: 'POST',
			headers:{
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${localStorage.getItem('token')}`
			}
		})

		setPlace({
			...place,
			comments: place.comments
				.filter((comment: { commentId: number; }) => comment.commentId !== deletedComment.commentId)
		})
	}



	async function createComment(commentAttributes: any) {
		const response = await fetch(`http://localhost:5000/places/${place.placeId}/comments`, {
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${localStorage.getItem('token')}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(commentAttributes)
		})

		const comment = await response.json()

		setPlace({
			...place,
			comments: [
				...place.comments,
				comment
			]
		})

	}



	let comments = (
		<h3 className="inactive">
			No comments yet!
		</h3>
	)
	let rating = (
		<h3 className="inactive">
			Not yet rated
		</h3>
	)
	if (place.comments.length) {
		let sumRatings = place.comments.reduce((tot: any, c: { stars: any; }) => {
			return tot + c.stars
		}, 0)
		let averageRating = Math.round(sumRatings / place.comments.length)
		let stars = ''
		for (let i = 0; i < averageRating; i++) {
			stars += '⭐️'
		}
		rating = (
			<h3>
				{stars} stars
			</h3>
		)
		comments = place.comments.map((comment:any) => {
			return (
				<CommentCard key={comment.commentId} comment={comment} onDelete={() => deleteComment(comment)} />
			)
		})
	}

	let placeActions = null
	if(CurrentUser?.role === 'admin'){
		placeActions = (
			<>
				<a className="btn btn-warning" onClick={deletePlace}>
					Delete
				</a>
			</>
		)
	}


	return (
		<main>
			<div className="row">
				<div className="col-sm-6">
					<img style={{ maxWidth: 200 }} src={place.pic} alt={place.name} />
					<h3>
						Located in {place.city}, {place.state}
					</h3>
				</div>
				<div className="col-sm-6">
					<h1>{place.name}</h1>
					<h2>
						Rating
					</h2>
					{rating}
					<br />
					<h2>
						Description
					</h2>
					<h3>
						{place.name} has been serving {place.city}, {place.state} since {place.founded}.
					</h3>
					<h4>
						Serving {place.cuisines}.
					</h4>
					<br />
					{placeActions}
				</div>
			</div>
			<hr />
			<h2>Comments</h2>
			<div className="row">
				{comments}
			</div>
			<hr />
			<h2>Got Your Own Rant or Rave?</h2>
			<NewCommentForm
				place={place}
				onSubmit={createComment}
			/>
		</main>
	)
}

export default PlaceDetails

function useContext(CurrentUser: React.Context<any>): { currentUser: any; } {
	throw new Error("Function not implemented.");
}

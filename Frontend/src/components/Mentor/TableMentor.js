import React, {useEffect, useState} from 'react';
import "./TableStyle.css";
import { json, useNavigate } from "react-router-dom";

const DisplayTable = ({data}) => {
    const keys =  ["name", "school"]
    
    const [coach, setCoach] = useState()
    const [studentIDs, setStudentIDs] = useState([])
    const [students, setStudents] = useState([])

    const coachID = "6373bf8650c5263f57ff20ab"

    let navigate = useNavigate();

    
    function homeButton(){
      navigate('/coachhome', {replace: true})
    }

    const getCoach = async(coachID) => {
        //console.log(id)
        try {
            const requestOptions = {
                method: 'POSt',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({'id': coachID})
            }
            const response = await fetch('/api/coachSearch', requestOptions)
            const jsonData = await response.json()

            //console.log(jsonData)
            setCoach(jsonData)
        } catch (error) {
            console.log(error)
        }
    }

    const getStudentsInTeams = async(teams) => {
        for(let i = 0; i < teams.length; i++){
            try {
                const requestOptions = {
                    method: 'GET',
                    headers: {'Content-Type': 'application/json'}
                };
                const response = await fetch('/api/teamsearch/' + JSON.stringify(teams[i]), requestOptions)
                const jsonData = await response.json()

                //console.log(jsonData[0].members)
                const tempArray = jsonData[0].members.map(item => item)
                //console.log(tempArray)
                // for(let i = 0; i < tempArray.length; i++){
                //     setStudentIDs(studentIds => [...studentIds, tempArray[i]])
                // }
                setStudentIDs([...studentIDs, ...tempArray])
                
                
            } catch (error) {
                
            }
        }
    }

    const getStudentsFromServer = async(ids) => {
        //console.log("size of ids: ", ids.length)
        console.log("ids: ", ids)
        var tempArray = []
        for (let i = 0; i < ids.length; i++) {
            console.log(i)
            try {
                const requestOptions = {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({'id': ids[i]})
                }
                const response = await fetch('/api/studentTakenQuizzes', requestOptions)
                const jsonData = await response.json()

                //console.log(jsonData)
                //tempArray = tempArray + jsonData
                //console.log(typeof tempArray)
                
                tempArray = [...tempArray, jsonData]
                console.log(tempArray)
                //setStudents(students => [...students, jsonData])
            } catch (error) {
                console.log(error)
            }
            
        }

        setStudents([...students, ...tempArray])
    }

    const takenQuizScoreSums = (category, takenQuizzes) => {
        if(!takenQuizzes.length == 0){
            console.log(category, " ", takenQuizzes)
            var count = 0
            var totalCorrectAnswers = 0
            var totalQuestions = 0
            for(let i = 0; i < takenQuizzes.length; i++){
                if(category == takenQuizzes[i].category){
                    totalCorrectAnswers += takenQuizzes[i].correctQuestions.length
                    totalQuestions += takenQuizzes[i].questions.length
                }
            }
            if(totalQuestions == 0){
                return "No Quizzes Taken"
            }
            else{
                return (totalCorrectAnswers + "/" + totalQuestions)
            }
            
        }

        return "No Quizzes Taken"
    }

    useEffect(() => {
        getCoach(coachID)
        console.log("default")
    }, []);

    useEffect(() => {
        //console.log(coach)
        if(coach){
            getStudentsInTeams(coach.teams)
            console.log("coach")
        }
    }, [coach]);

    useEffect(() => {
        if(studentIDs){
            getStudentsFromServer(studentIDs)
            console.log("studentIDs")
        }
    }, [studentIDs])

    useEffect(() => {
        if(students){
            console.log(students)
            //console.log("students")
        }
    }, [students])
    
    return (
            <div>
           <div className='flex justify-between my-8'>
            </div>
                <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Windows</th>
                                <th>Win_Server</th>
                                <th>Linux</th>
                                <th>Networking</th>
                                <th>Security_Concepts</th>
                            </tr>
                        </thead>

                         <tbody>
                                {students && students.map(item => (
                                    <tr>
                                        <td>{item.displayname}</td>
                                        <td>{takenQuizScoreSums("windows", item.takenQuizzes)}</td>
                                        <td>{takenQuizScoreSums("win_server", item.takenQuizzes)}</td>
                                        <td>{takenQuizScoreSums("linux", item.takenQuizzes)}</td>
                                        <td>{takenQuizScoreSums("networking", item.takenQuizzes)}</td>
                                        <td>{takenQuizScoreSums("security_concepts", item.takenQuizzes)}</td>
                                    </tr>
                                ))}
                        </tbody>
                </table>
                <button onClick={homeButton}>
            Home
            </button>
            

            </div>
        )
}


export default  DisplayTable